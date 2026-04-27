'use client'; // Necesario para usar hooks como useState

import { useState, useEffect } from 'react';
import { supabase } from '../../src/supabaseClient.mjs';

export default function EquiposPage() {
    const [equipos, setEquipos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [representante, setRepresentante] = useState('');
    const [cargando, setCargando] = useState(false);

    // Función para obtener equipos
    const fetchEquipos = async () => {
        const { data, error } = await supabase
            .from('equipos')
            .select('*')
            .order('fecha_creacion', { ascending: false });
        if (!error) setEquipos(data);
    };

    useEffect(() => {
        fetchEquipos();
    }, []);

    // Función para inscribir equipo
    const handleInscribir = async (e) => {
        e.preventDefault();
        setCargando(true);

        const { error } = await supabase
            .from('equipos')
            .insert([{ nombre, representante }]);

        if (error) {
            alert("Error al inscribir: " + error.message);
        } else {
            setNombre('');
            setRepresentante('');
            fetchEquipos(); // Refresca la lista automáticamente
        }
        setCargando(false);
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: '#1d4ed8' }}>🏆 Panel de Inscripción DeporStar</h1>

            {/* FORMULARIO */}
            <form onSubmit={handleInscribir} style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>Inscribir Nuevo Equipo</h3>
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Nombre del Equipo" 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Representante" 
                        value={representante}
                        onChange={(e) => setRepresentante(e.target.value)}
                        style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={cargando}
                        style={{ padding: '8px 20px', background: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {cargando ? 'Inscribiendo...' : 'Inscribir'}
                    </button>
                </div>
            </form>

            {/* TABLA DE RESULTADOS */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#1d4ed8', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Equipo</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Representante</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Puntos</th>
                    </tr>
                </thead>
                <tbody>
                    {equipos.map((equipo) => (
                        <tr key={equipo.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px' }}>{equipo.nombre}</td>
                            <td style={{ padding: '12px' }}>{equipo.representante}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{equipo.puntos_totales}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}