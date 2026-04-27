require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function inscribirEquipo() {
    console.log("📝 Inscribiendo primer equipo...");

    const { data, error } = await supabase
        .from('equipos')
        .insert([
            { nombre: 'DeporStar FC', representante: 'Jhonatan' }
        ])
        .select(); // Esto es para que nos devuelva el registro creado

    if (error) {
        console.error('❌ Error al insertar:', error.message);
    } else {
        console.log('✅ ¡Equipo inscrito con éxito!');
        console.log('Ficha del equipo:', data);
    }
}

inscribirEquipo();