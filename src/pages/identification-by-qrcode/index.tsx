import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FaQrcode } from 'react-icons/fa';
import { BsQrCode } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useUser } from '../../providers/userContextValues';
import type { Veiculo } from '../../types';

type CameraStatus = 'loading' | 'active' | 'error';

const IdentificationByQrCode = () => {
  const { getVehiclesByPlate, navigate, setVehicleSelected, setPneusSelected } = useUser();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastReadRef = useRef({ text: '', time: 0 });
  const handleQrTextRef = useRef<(text: string) => boolean>(() => false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('loading');
  const [cameraMessage, setCameraMessage] = useState('');

  const openVehicle = (vehicle: Veiculo) => {
    setVehicleSelected(vehicle);
    setPneusSelected(vehicle.pneus);
    toast.success(`QR Code lido: veículo ${vehicle.placa}`);
    navigate('/vehicle-dashboard');
  };

  const handleSimulatedScan = () => {
    const vehicle = getVehiclesByPlate('EJDH45');
    if (vehicle) openVehicle(vehicle);
  };

  useEffect(() => {
    handleQrTextRef.current = (text: string) => {
      const now = Date.now();
      const { text: lastText, time } = lastReadRef.current;
      if (text === lastText && now - time < 3000) return false;
      lastReadRef.current = { text, time: now };

      const vehicle = getVehiclesByPlate(text.trim());
      if (!vehicle) return false;

      openVehicle(vehicle);
      return true;
    };
  });

  useEffect(() => {
    let active = true;
    let stream: MediaStream | null = null;
    let frameId = 0;

    const scanFrame = () => {
      if (!active) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const width = 400;
        const height = Math.round((video.videoHeight / video.videoWidth) * width) || 300;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (context) {
          context.drawImage(video, 0, 0, width, height);
          const image = context.getImageData(0, 0, width, height);
          const code = jsQR(image.data, width, height, { inversionAttempts: 'dontInvert' });
          if (code?.data && handleQrTextRef.current(code.data)) return;
        }
      }

      frameId = requestAnimationFrame(scanFrame);
    };

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus('error');
        setCameraMessage('Câmera não disponível neste dispositivo.');
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (!active || !videoRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraStatus('active');
        frameId = requestAnimationFrame(scanFrame);
      } catch (error) {
        if (!active) return;
        const denied = error instanceof DOMException && error.name === 'NotAllowedError';
        setCameraStatus('error');
        setCameraMessage(
          denied ? 'Permissão da câmera negada.' : 'Não foi possível acessar a câmera.'
        );
      }
    };

    startCamera();

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <TemplatePage>
      <main className={styles.identificationContainer}>
        <h1 className={styles.title}>Posicione o QR Code dentro desta caixa para ler</h1>

        <div className={styles.scannerBox}>
          <video
            ref={videoRef}
            className={`${styles.video} ${cameraStatus === 'active' ? styles.visible : ''}`}
            muted
            playsInline
          />
          <canvas ref={canvasRef} className={styles.canvas} />

          {cameraStatus === 'active' && <span className={styles.scanLine} />}

          {cameraStatus !== 'active' && (
            <button
              type="button"
              className={styles.placeholder}
              onClick={handleSimulatedScan}
              aria-label="Simular leitura do QR Code"
            >
              <BsQrCode size={cameraStatus === 'error' ? 150 : 200} />
              {cameraStatus === 'loading' && <p>Abrindo a câmera...</p>}
              {cameraStatus === 'error' && (
                <p>
                  {cameraMessage}
                  <br />
                  Toque para simular a leitura.
                </p>
              )}
            </button>
          )}
        </div>

        <button
          type="button"
          className={styles.buttonScan}
          onClick={handleSimulatedScan}
          aria-label="Simular leitura do QR Code"
          title="Simular leitura do QR Code"
        >
          <FaQrcode size={32} />
        </button>
      </main>
    </TemplatePage>
  );
};

export default IdentificationByQrCode;
