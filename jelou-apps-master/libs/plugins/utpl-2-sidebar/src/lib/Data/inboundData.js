export const CATEGORIA = [
  {
    value: 'INCONSISTENCIAS',
    label: 'Inconsistencias'
  },
  {
    value: 'MATRICULA',
    label: 'Matrícula'
  },
  {
    value: 'TRAMITES',
    label: 'Trámites'
  },
  {
    value: 'TRANSFERENCIAS',
    label: 'Transferencias'
  },
  {
    value: 'CURSOS',
    label: 'Cursos'
  }
]

export const TIPO = {
  INCONSISTENCIAS: [
    { value: 'LLAMADA', label: 'Llamada' },
    { value: 'INTERACCION', label: 'Interacción' }
  ],
  MATRICULA: [{ value: 'OFERTA', label: 'Oferta' }],
  TRAMITES: [
    { value: 'CONSULTAS', label: 'Consultas' },
    { value: 'EVALUACION-O-CALIFICACION', label: 'Evaluación o Calificación' },
    { value: 'RECONOCIMIENTOS', label: 'Reconocimientos' },
    { value: 'PLATAFORMA-DE-APRENDIZAJE', label: 'Plataforma de aprendizaje' }
  ],
  TRANSFERENCIAS: [
    { value: 'ADMINISTRATIVO', label: 'Administrativo' },
    { value: 'TUTOR', label: 'Tutor' },
    { value: 'UNIDADES', label: 'Unidades' }
  ],
  CURSOS: [
    { value: 'EDUCACION-CONTINUA', label: 'Educación continua' },
    { value: 'FORMACION-BASICA', label: 'Formación básica' },
    { value: 'EDES-CIMA-CERTILAC', label: 'EDES - CIMA - CERTILAC' }
  ]
}

export const SUBTIPO = {
  LLAMADA: [
    {
      value: 'LLAMADA-CON-INTERFERENCIA-O-MUDA',
      label: 'Llamada con interferencia o muda'
    },
    {
      value: 'INTERACCION-DE-OFENSA-O-BURLA',
      label: 'Interacción de ofensa o burla'
    }
  ],
  INTERACCION: [
    { value: 'INTERACCION-SIN-MOTIVO', label: 'Interacción sin motivo' }
  ],
  OFERTA: [
    {
      value: 'SISTEMA-Y-PROCESO-DE-MATRICULA',
      label: 'Sistema y proceso de matrícula'
    },
    {
      value: 'OFERTA-MODALIDAD-A-DISTANCIA',
      label: 'Oferta modalidad a distancia'
    },
    { value: 'BECAS', label: 'Becas' },
    { value: 'POSTGRADO', label: 'Postgrado ' },
    {
      value: 'OFERTA-MODALIDAD-PRESENCIAL',
      label: 'Oferta modalidad presencial'
    },
    { value: 'ESTUDIANTES-ANTIGUOS', label: 'Estudiantes antiguos' }
  ],
  CONSULTAS: [
    {
      value: 'ESTADO-O-PROCESO-PARA-UN-TRAMITE',
      label: 'Estado o proceso para un trámite'
    },
    {
      value: 'ATENCION-EN-CENTROS-UNIVERSITARIOS',
      label: 'Atencion en centros universitarios'
    },
    { value: 'EMISION-DE-CERTIFICADOS', label: 'Emisión de certificados' },
    { value: 'MÉTODO-DE-CALIFICACION', label: 'Método de calificación' },
    {
      value: 'ESTADO-MATERIAL-BIBLIOGRAFICO-(FISICO--DIGITAL-O-TABLET)',
      label: 'Estado material bibliografico (fisico- digital o tablet)'
    },
    {
      value: 'EVENTOS-(JORNADA-SEMINARIOS-CONGRESOS-ENCUENTROS-ETC.)',
      label: 'Eventos (Jornada- seminarios- congresos- encuentros- etc.)'
    },
    { value: 'UTE', label: 'UTE' }
  ],
  'EVALUACION-O-CALIFICACION': [
    { value: 'EXAMENES', label: 'Exámenes' },
    {
      value: 'EVALUACIONES-PRESENCIALES-AUTOMÁTICAS-EN-LINEA',
      label: 'Evaluaciones presenciales automáticas en línea'
    },
    { value: 'COMPETENCIAS-ESPECIFICAS', label: 'Competencias específicas' },
    {
      value:
        'ACTIVIDADES-ACADEMICAS-EN-LINEA:-FORO-WIKI-CHAT-VIDEOCOLABORACION-CUESTIONARIOS-TAREAS',
      label:
        'Actividades academicas en linea: Foro- wiki- Chat- videocolaboracion- cuestionarios- tareas'
    },
    {
      value: 'CAMBIO-DE-FECHA-DE-EXAMENES',
      label: 'Cambio de fecha de exámenes'
    },
    {
      value: 'CAMBIO-DE-CENTRO-TEMPORAL-O-PERMANENTE',
      label: 'Cambio de centro temporal o permanente'
    },
    {
      value: 'EVALUACIONES-PRESENCIALES-TRADICIONALES-FISICAS',
      label: 'Evaluaciones presenciales tradicionales físicas'
    },
    {
      value: 'HOJAS-DE-RESPUESTAS-CUADERNILLOS',
      label: 'Hojas de respuestas - cuadernillos'
    },
    {
      value: 'RECALIFICACION-(ACTIVIDADES-O-EVALUACIONES)',
      label: 'Recalificación (actividades o evaluaciones)'
    },
    { value: 'ENVIO-DE-TAREAS', label: 'Envío de tareas' }
  ],
  RECONOCIMIENTOS: [
    {
      value: 'VALIDACION-DE-CONOCIMIENTO',
      label: 'Validación de conocimiento'
    },
    { value: 'HOMOLOGACION-EXTERNA', label: 'Homologación - externa' },
    { value: 'HOMOLOGACIÓN-INTERNA', label: 'Homologación - interna' }
  ],
  'PLATAFORMA-DE-APRENDIZAJE': [
    { value: 'CANVAS', label: 'Canvas' },
    { value: 'MOODLE', label: 'Moodle' }
  ],
  ADMINISTRATIVO: [
    {
      value: 'INFORMACION-(HORARIO-EXTENSIÓN-NOMBRE-CARGO)',
      label: 'Información (horario - extensión-  nombre - cargo)'
    }
  ],
  TUTOR: [
    {
      value: 'INFORMACION-(HORARIO-EXTENSIÓN-NOMBRE-CARGO)',
      label: 'Información (horario - extensión-  nombre - cargo)'
    }
  ],
  UNIDADES: [
    {
      value: 'MESA-DE-SERVICIOS-TECNOLOGICOS-URBANO-ASERTEC-PRENDHO',
      label: 'Mesa de servicios tecnologicos - Urbano - Asertec - Prendho'
    }
  ],
  'EDUCACION-CONTINUA': [
    { value: 'CRUSOS-INTERNOS-Y-EXTERNOS', label: 'Crusos internos y externos' }
  ],
  'FORMACION-BASICA': [
    { value: 'INGLES', label: 'Inglés' },
    { value: 'COMPETENCIAS-ESPECIFICAS', label: 'Competencias específicas' },
    { value: 'MOOCS', label: 'MOOCs' }
  ],
  'EDES-CIMA-CERTILAC': [{ value: 'INFORMACION', label: 'Información' }]
}

export const MOTIVO = {
  'LLAMADA-CON-INTERFERENCIA-O-MUDA': [
    { value: 'INCONSISTENCIA', label: 'Inconsistencia' }
  ],
  'INTERACCION-DE-OFENSA-O-BURLA': [
    { value: 'INFORMACION', label: 'Informacion' }
  ],
  'INTERACCION-SIN-MOTIVO': [{ value: 'RECLAMO', label: 'Reclamo' }],
  'SISTEMA-Y-PROCESO-DE-MATRICULA': [{ value: 'SOPORTE', label: 'Soporte' }]
}

export const RESULTADO = {
  INCONSISTENCIA: [{ value: 'RESUELTO', label: 'Resuelto' }],
  INFORMACION: [{ value: 'SEGUIMIENTO', label: 'Seguimiento' }]
}
