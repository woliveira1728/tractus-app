import { Navigate, useNavigate, useParams } from 'react-router-dom';
import TemplatePage from '../template';
import { useUser } from '../../providers/userContextValues';
import type { ServiceStatus } from '../../types';
import pneuTractus from '../../assets/frame29-pneu.svg';
import styles from './styles.module.scss';
import { useState } from 'react';

const statusLabels: Record<ServiceStatus, string> = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  reprovado: 'Não Aprovado',
};

function ManagerServiceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { user, serviceOrders, updateServiceOrderStatus } = useUser();

  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [justification, setJustification] = useState('');
  const [validationError, setValidationError] = useState('');


  const orderId = Number(id);
  const order = serviceOrders.find(
    (item) => item.id === orderId
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'gerente') {
    return <Navigate to="/identification" replace />;
  }

  if (!id || !Number.isSafeInteger(orderId) || !order) {
    return (
      <TemplatePage
        showBack
        onBack={() => navigate('/manager/services')}
      >
        <main className={styles.container}>
          <h1 className={styles.title}>
            Serviço não encontrado
          </h1>
          <p className={styles.observationBox}>
            A ordem de serviço solicitada não foi localizada.
          </p>
        </main>
      </TemplatePage>
    );
  }

const approveService = () => {
  if (order.status !== 'pendente') return;

  const updatedOrder = updateServiceOrderStatus(
    order.id,
    'aprovado'
  );

  if (updatedOrder) {
    navigate('/manager/service-approved', {
      replace: true,
    });
  }
};

const rejectService = () => {
  if (order.status !== 'pendente') return;

  const reason = justification.trim();

  if (!reason) {
    setValidationError('Informe a justificativa da reprovação.');
    return;
  }

  const updatedOrder = updateServiceOrderStatus(
    order.id,
    'reprovado',
    reason
  );

  if (updatedOrder) {
    setValidationError('');
    setShowRejectionForm(false);

    navigate('/manager/service-rejected', {
      replace: true,
    });
  }
};

  return (
    <TemplatePage
      showBack
      onBack={() => navigate('/manager/services')}
    >
      <main className={styles.container}>
        <h1 className={styles.title}>
          Detalhes do Serviço
        </h1>

        <article className={styles.serviceCard}>
          <div className={styles.cardHeader}>
            <h2>Serviço #{order.id}</h2>
            <span
              className={`${styles.badge} ${styles[order.status]}`}
            >
              {statusLabels[order.status]}
            </span>
          </div>

          <div className={styles.cardBody}>
            <img
              src={pneuTractus}
              alt="Ilustração de pneu"
              className={styles.tireImage}
            />

            <div className={styles.serviceInfo}>
              <p>Placa: {order.placa}</p>
              <p>Veículo: {order.veiculo}</p>
              <p>Data: {order.dataHora}</p>
            </div>
          </div>
        </article>

        <section className={styles.section}>
          <h2>Resumo do serviço</h2>

          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span>Tipo de serviço</span>
              <strong>{order.tipoServico}</strong>
            </div>

            <div className={styles.infoRow}>
              <span>Pneus envolvidos</span>
              <strong>{order.pneusEnvolvidos}</strong>
            </div>

            <div className={styles.infoRow}>
              <span>Profundidade do sulco</span>
              <strong>{order.profundidadeSulco} mm</strong>
            </div>

            <div className={styles.infoRow}>
              <span>Nova pressão</span>
              <strong>{order.novaPressao} PSI</strong>
            </div>

            <div className={styles.infoRow}>
              <span>Última pressão medida</span>
              <strong>{order.ultimaPressaoMedida} PSI</strong>
            </div>

            <div className={styles.infoRow}>
              <span>Número de fogo</span>
              <strong>{order.numeroFogo}</strong>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Movimentações realizadas</h2>

          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span>Rodízio</span>
              <strong>
                {order.movimentacoesRealizadas.rodizio}
              </strong>
            </div>

            <div className={styles.infoRow}>
              <span>Substituição</span>
              <strong>
                {order.movimentacoesRealizadas.substituicao}
              </strong>
            </div>

            {order.movimentacoesRealizadas.sucateado && (
              <div className={styles.infoRow}>
                <span>Sucateamento</span>
                <strong>Sim</strong>
              </div>
            )}

            {order.movimentacoesRealizadas.vendido && (
              <div className={styles.infoRow}>
                <span>Venda</span>
                <strong>Sim</strong>
              </div>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Observações do técnico</h2>
          <div className={styles.observationBox}>
            {order.observacoesTecnico}
          </div>
        </section>


{order.status === 'pendente' && (
  <section className={styles.section}>
    <h2>Aprovação do serviço</h2>

    <div className={styles.actionButtons}>
      <button
        type="button"
        className={styles.approveButton}
        onClick={approveService}
      >
        Aprovar Serviço
      </button>

      <button
        type="button"
        className={styles.rejectButton}
        onClick={() => setShowRejectionForm(true)}
      >
        Não Aprovar
      </button>
    </div>

    {showRejectionForm && (
      <div className={styles.rejectionForm}>
        <label htmlFor="manager-justification">
          Justificativa da reprovação
        </label>

        <textarea
          id="manager-justification"
          value={justification}
          onChange={(event) => {
            setJustification(event.target.value);
            setValidationError('');
          }}
          placeholder="Descreva o motivo da reprovação..."
          rows={4}
          aria-required="true"
        />

        {validationError && (
          <p role="alert">{validationError}</p>
        )}

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => {
              setShowRejectionForm(false);
              setValidationError('');
            }}
          >
            Cancelar
          </button>

          <button type="button" onClick={rejectService}>
            Confirmar reprovação
          </button>
        </div>
      </div>
    )}
  </section>
)}

        {order.homologadoPor && (
          <section className={styles.section}>
            <h2>Homologação do serviço</h2>

            <div className={styles.infoBox}>
              <p>Responsável: {order.homologadoPor}</p>
              <p>Data: {order.dataHomologacao}</p>

              {order.justificativaGerente && (
                <p>
                  Justificativa: {order.justificativaGerente}
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </TemplatePage>
  );
}

export default ManagerServiceDetailsPage;
