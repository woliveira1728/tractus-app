
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FiSearch, FiMenu } from 'react-icons/fi';
import pneuTractus from '../../assets/frame29-pneu.svg';
import TemplatePage from '../template';
import { useUser } from '../../providers/userContextValues';
import type { ServiceStatus } from '../../types';
import styles from './styles.module.scss';

type StatusFilter = 'todos' | ServiceStatus;

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'aprovado', label: 'Aprovados' },
  { value: 'reprovado', label: 'Não Aprovados' },
];

const statusLabels: Record<ServiceStatus, string> = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  reprovado: 'Não Aprovado',
};

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();

function ManagerServicesPage() {
  const { user, serviceOrders } = useUser();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [showFilters, setShowFilters] = useState(true);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'gerente') {
    return <Navigate to="/identification" replace />;
  }

  const query = normalize(search);

  const filteredOrders = serviceOrders.filter((order) => {
    const matchesStatus =
      statusFilter === 'todos' || order.status === statusFilter;

    const matchesSearch = [
      order.placa,
      order.veiculo,
      order.numeroFogo,
      order.pneusEnvolvidos,
    ].some((value) => normalize(value).includes(query));

    return matchesStatus && matchesSearch;
  });

  return (
    <TemplatePage showBack={false}>
      <main className={styles.container}>
        <h1 className={styles.title}>Histórico de Serviços</h1>

        <div className={styles.searchRow}>
          <div className={styles.searchBox}>
            <input
              type="search"
              aria-label="Buscar por placa, veículo ou pneu"
              placeholder="Placa, veículo ou pneu..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <FiSearch size={20} aria-hidden="true" />
          </div>

          <button
            type="button"
            className={styles.menuButton}
            aria-label={
              showFilters ? 'Ocultar filtros' : 'Mostrar filtros'
            }
            aria-expanded={showFilters}
            aria-controls="manager-service-filters"
            onClick={() => setShowFilters((previous) => !previous)}
          >
            <FiMenu size={22} aria-hidden="true" />
          </button>
        </div>

        <div
          id="manager-service-filters"
          className={styles.filters}
          role="group"
          aria-label="Filtrar serviços por situação"
          hidden={!showFilters}
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={statusFilter === filter.value}
              className={
                statusFilter === filter.value
                  ? styles.activeFilter
                  : ''
              }
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {filteredOrders.length === 0 ? (
            <p className={styles.empty} role="status">
              Nenhum serviço encontrado.
            </p>
          ) : (
            filteredOrders.map((order) => (
              <article key={order.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>Serviço #{order.id}</h2>

                  <span
                    className={`${styles.badge} ${styles[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.tireIcon} aria-hidden="true"> 
                    <img src={pneuTractus} alt="" />
                  </div>

                  <div className={styles.description}>
                    <p>Placa: {order.placa}</p>
                    <p>Veículo: {order.veiculo}</p>
                    <p>Data: {order.dataHora}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </TemplatePage>
  );
}

export default ManagerServicesPage;
