import { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../_app';
import Sidebar from '../../components/Sidebar';
import MobileMenuToggle from '../../components/MobileMenuToggle';
import DashboardWidget from '../../components/admin/DashboardWidget';
import RecentStats from '../../components/admin/RecentStats';
import ActivityFeed from '../../components/admin/ActivityFeed';


export default function Admin() {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const [stationCount, setStationCount] = useState(0);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [onTimeRatio, setOnTimeRatio] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Charger les données des stations
    const savedStations = localStorage.getItem('stations');
    if (savedStations) {
      const stations = JSON.parse(savedStations);
      setStationCount(stations.length);
    }

    // Charger les données des horaires
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      const schedules = JSON.parse(savedSchedules);
      setScheduleCount(schedules.length);
      setOnTimeRatio(98);
    }

    // Simuler des activités récentes
    setActivities([
      {
        title: 'Nouvelle annonce créée',
        time: 'Il y a 5 minutes',
        icon: 'campaign',
        color: 'primary',
        description: 'Annonce de retard pour le TER 857412'
      },
      {
        title: 'Horaire modifié',
        time: 'Il y a 15 minutes',
        icon: 'schedule',
        color: 'warning',
        description: 'Modification de l\'horaire du train Paris-Lyon'
      },
      {
        title: 'Nouvelle station ajoutée',
        time: 'Il y a 1 heure',
        icon: 'train',
        color: 'success',
        description: 'Station "Gare de Lyon-Part-Dieu" ajoutée'
      }
    ]);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      title: 'Trafic Journalier',
      value: '2,547',
      icon: 'trending_up',
      color: 'success',
      change: 12,
      subtitle: 'Trains en circulation aujourd\'hui'
    },
    {
      title: 'Ponctualité',
      value: '96%',
      icon: 'timer',
      color: 'primary',
      change: 3,
      subtitle: 'Moyenne sur les 30 derniers jours'
    },
    {
      title: 'Annonces Diffusées',
      value: '1,286',
      icon: 'campaign',
      color: 'info',
      change: 8,
      subtitle: 'Dernières 24 heures'
    },
    {
      title: 'Alertes Actives',
      value: '3',
      icon: 'warning',
      color: 'warning',
      change: -25,
      subtitle: 'Perturbations en cours'
    }
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <MobileMenuToggle />
      
      <main className="sncf-content">
        <div className="d-flex align-items-center bg-white p-3 shadow-sm mb-4">
          <h1 className="sncf-title mb-0">Dashboard Admin</h1>
        </div>

        <div className="container-fluid">
          <div className="row g-4 mb-4">
            <div className="col-xl-3 col-md-6">
              <DashboardWidget
                title="Nombre de gares"
                value={stationCount}
                icon="train"
                color="primary"
                onClick={() => router.push('/stations')}
              />
            </div>
            <div className="col-xl-3 col-md-6">
              <DashboardWidget
                title="Horaires créés"
                value={scheduleCount}
                icon="schedule"
                color="info"
                onClick={() => router.push('/admin/horaires')}
              />
            </div>
            <div className="col-xl-3 col-md-6">
              <DashboardWidget
                title="Ratio de ponctualité"
                value={`${onTimeRatio || 0}%`}
                icon="verified"
                color="success"
              />
            </div>
            <div className="col-xl-3 col-md-6">
              <DashboardWidget
                title="Système d'annonces"
                value="Accéder"
                icon="campaign"
                color="warning"
                onClick={() => router.push('/admin/banque-de-sons')}
              />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <RecentStats stats={stats} />
            </div>
            <div className="col-lg-4">
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </main>
       
    </div>
  );
}