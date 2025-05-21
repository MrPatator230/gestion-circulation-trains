import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../_app';

export default function MaterielsRoulants() {
  const { role, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [newRegionName, setNewRegionName] = useState('');
  const [materiels, setMateriels] = useState([]);
  const [filteredMateriels, setFilteredMateriels] = useState([]);
  const [editingMaterielId, setEditingMaterielId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, role, router]);

  useEffect(() => {
    const savedRegions = localStorage.getItem('materielsRegions');
    if (savedRegions) {
      setRegions(JSON.parse(savedRegions));
    }
    const savedMateriels = localStorage.getItem('materielsRoulants');
    if (savedMateriels) {
      setMateriels(JSON.parse(savedMateriels));
    }
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      setFilteredMateriels(materiels.filter(m => m.region === selectedRegion));
    } else {
      setFilteredMateriels([]);
    }
  }, [materiels, selectedRegion]);

  const saveRegions = (newRegions) => {
    setRegions(newRegions);
    localStorage.setItem('materielsRegions', JSON.stringify(newRegions));
  };

  const saveMateriels = (newMateriels) => {
    setMateriels(newMateriels);
    localStorage.setItem('materielsRoulants', JSON.stringify(newMateriels));
  };

  const handleAddRegion = () => {
    const trimmedName = newRegionName.trim();
    if (!trimmedName) {
      alert('Le nom de la région ne peut pas être vide.');
      return;
    }
    if (regions.includes(trimmedName)) {
      alert('Cette région existe déjà.');
      return;
    }
    const newRegions = [...regions, trimmedName];
    saveRegions(newRegions);
    setNewRegionName('');
    setSelectedRegion(trimmedName);
  };

  const handleDeleteRegion = (regionName) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la région "${regionName}" et tous ses matériels roulants ?`)) {
      const newRegions = regions.filter(r => r !== regionName);
      saveRegions(newRegions);
      const newMateriels = materiels.filter(m => m.region !== regionName);
      saveMateriels(newMateriels);
      if (selectedRegion === regionName) {
        setSelectedRegion('');
      }
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setImageName(e.target.files[0]?.name || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRegion) {
      alert('Veuillez sélectionner une région.');
      return;
    }
    if (!imageName.trim() || (editingMaterielId === null && !imageFile)) {
      alert('Veuillez saisir un nom pour le fichier et choisir une image si vous ajoutez un nouveau matériel.');
      return;
    }

    const processSave = (imageData) => {
      if (editingMaterielId !== null) {
        // Update existing materiel
        const updatedMateriels = materiels.map(m => {
          if (m.id === editingMaterielId) {
            return {
              ...m,
              region: selectedRegion,
              imageName: imageName.trim(),
              imageData: imageData || m.imageData,
            };
          }
          return m;
        });
        saveMateriels(updatedMateriels);
      } else {
        // Add new materiel
        const newMateriel = {
          id: Date.now(),
          region: selectedRegion,
          imageData,
          imageName: imageName.trim(),
        };
        saveMateriels([...materiels, newMateriel]);
      }
      setImageFile(null);
      setImageName('');
      setEditingMaterielId(null);
      e.target.reset();
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processSave(reader.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      // No new image file, keep existing imageData
      processSave(null);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce matériel roulant ?')) {
      const newMateriels = materiels.filter(m => m.id !== id);
      saveMateriels(newMateriels);
      if (editingMaterielId === id) {
        setEditingMaterielId(null);
        setImageFile(null);
        setImageName('');
      }
    }
  };

  const handleEdit = (materiel) => {
    setEditingMaterielId(materiel.id);
    setSelectedRegion(materiel.region);
    setImageName(materiel.imageName);
    setImageFile(null);
  };

  return (
    <div id="wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
        <div id="content" className="container mt-4 flex-grow-1 d-flex">
          <div style={{ width: '250px', marginRight: '1rem' }}>
            <h2>Régions</h2>
            <ul className="list-group mb-3">
              {regions.map(region => (
                <li
                  key={region}
                  className={`list-group-item d-flex justify-content-between align-items-center ${selectedRegion === region ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRegion(region);
                    }}
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nouvelle région"
                value={newRegionName}
                onChange={(e) => setNewRegionName(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleAddRegion}>Ajouter</button>
            </div>
          </div>

          <div className="flex-grow-1">
            <h1>Gestion des Matériels Roulants {selectedRegion && `- Région: ${selectedRegion}`}</h1>
            {!selectedRegion ? (
              <p>Veuillez sélectionner une région pour gérer ses matériels roulants.</p>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="mb-4">
                  <div className="mb-3">
                    <label htmlFor="imageName" className="form-label">Nom du fichier</label>
                    <input
                      type="text"
                      id="imageName"
                      className="form-control"
                      value={imageName}
                      onChange={(e) => setImageName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="imageFile" className="form-label">Image du Matériel Roulant {editingMaterielId !== null ? '(laisser vide pour garder l\'image actuelle)' : ''}</label>
                    <input
                      type="file"
                      id="imageFile"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                      {...(editingMaterielId === null ? { required: true } : {})}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">{editingMaterielId !== null ? 'Modifier' : 'Ajouter'}</button>
                  {editingMaterielId !== null && (
                    <button
                      type="button"
                      className="btn btn-secondary ms-2"
                      onClick={() => {
                        setEditingMaterielId(null);
                        setImageFile(null);
                        setImageName('');
                      }}
                    >
                      Annuler
                    </button>
                  )}
                </form>

                {filteredMateriels.length === 0 ? (
                  <p>Aucun matériel roulant ajouté pour cette région.</p>
                ) : (
                  <div className="row">
                    {filteredMateriels.map(materiel => (
                      <div key={materiel.id} className="col-md-4 mb-4">
                        <div className="card">
                          <img src={materiel.imageData} alt={materiel.imageName} className="card-img-top" style={{ maxHeight: '200px', objectFit: 'contain' }} />
                          <div className="card-body">
                            <h5 className="card-title">{materiel.imageName}</h5>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(materiel)}>Modifier</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(materiel.id)}>Supprimer</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
