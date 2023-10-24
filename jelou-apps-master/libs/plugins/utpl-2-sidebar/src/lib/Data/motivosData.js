export const NOMENCLATURA = [
  { value: 'aceptacion', label: 'ACEPTACION' },
  { value: 'pendienteDeAceptacion', label: 'PENDIENTE DE ACEPTACION' },
  { value: 'noAceptacion', label: 'NO ACEPTACION' },
  { value: 'noContactoNoJustificado', label: 'NO CONTACTO NO JUSTIFICADO' }
]

export const MOTIVOS = {
  aceptacion: [
    { label: 'Con pago', value: 'CON-PAGO' },
    {
      label: 'Financiamiento utpl plan A',
      value: 'FINANCIAMIENTO-UTPL-PLAN-A'
    },
    { label: 'Sin pago', value: 'SIN-PAGO' },
    {
      label: 'Sin pago con deuda al banco',
      value: 'SIN-PAGO-CON-DEUDA-AL-BANCO'
    },
    {
      label: 'Sin pago con tarjeta de crédito',
      value: 'SIN-PAGO-CON-TARJETA-DE-CREDITO'
    }
  ],
  pendienteDeAceptacion: [
    {
      label: 'Acept costos consultará con familia',
      value: 'ACEPT-COSTOS-CONSULTARA-CON-FAMILIA'
    },
    {
      label: 'Acept costos esperando beca',
      value: 'ACEPT-COSTOS-ESPERANDO-BECA'
    },
    {
      label: 'Acept costos necesita analizar, verficar o como prcs',
      value: 'ACEPT-COSTOS-NECESITA-ANALIZAR-VERFICAR-O-COMO-PRCS'
    },
    {
      label: 'Acept costos pendiente tc discovery',
      value: 'ACEPT-COSTOS-PENDIENTE-TC-DISCOVERY'
    },
    {
      label: 'Acept pers esperando resultado de pruebas o trámites',
      value: 'ACEPT-PERS-ESPERANDO-RESULTADO-DE-PRUEBAS-O-TRÁMITES'
    },
    {
      label: 'Acept pers prefiere acercarse a un centro utpl',
      value: 'ACEPT-PERS-PREFIERE-ACERCARSE-A-UN-CENTRO-UTPL'
    },
    {
      label: 'Acept pers quiere pensar y leer más la información',
      value: 'ACEPT-PERS-QUIERE-PENSAR-Y-LEER-MAS-LA-INFORMACION'
    },
    { label: 'Acept pers reingreso', value: 'ACEPT-PERS-REINGRESO' },
    { label: 'Continuará por si solo', value: 'CONTINUARA-POR-SI-SOLO' },
    { label: 'Escalado a mst', value: 'ESCALADO-A-MST' },
    {
      label: 'Validación trayectoria adm pública',
      value: 'VALIDACION-TRAYECTORIA-ADM-PUBLICA'
    }
  ],
  noAceptacion: [
    {
      label: 'Estudiante utpl 2do. en adelante',
      value: 'ESTUDIANTE-UTPL-2DO.-EN-ADELANTE'
    },
    {
      label: 'Información para un familiar',
      value: 'INFORMACION-PARA-UN-FAMILIAR'
    },
    {
      label: 'Neg académicos carreras ofertadas no son las que desea',
      value: 'NEG-ACADÉMICOS-CARRERAS-OFERTADAS-NO-SON-LAS-QUE-DESEA'
    },
    {
      label: 'Neg académicos estudia ahora en otra universidad',
      value: 'NEG-ACADEMICOS-ESTUDIA-AHORA-EN-OTRA-UNIVERSIDAD'
    },
    {
      label: 'Neg académicos interesado en curso d educ continua',
      value: 'NEG-ACADEMICOS-INTERESADO-EN-CURSO-D-EDUC-CONTINUA'
    },
    {
      label: 'Neg académicos interesado en maestría',
      value: 'NEG-ACADEMICOS-INTERESADO-EN-MAESTRIA'
    },
    {
      label: 'Neg académicos no desea estudiar a distancia',
      value: 'NEG-ACADEMICOS-NO-DESEA-ESTUDIAR-A-DISTANCIA'
    },
    {
      label: 'Neg-académicos-porque-no-les-atendien-sus-trámites',
      value: 'NEG-ACADÉMICOS-PORQUE-NO-LES-ATENDIEN-SUS-TRAMITES'
    },
    {
      label: 'Neg costos no tiene dinero',
      value: 'NEG-COSTOS-NO-TIENE-DINERO'
    },
    {
      label: 'Neg pers aun no es bachiller',
      value: 'NEG-PERS-AUN-NO-ES-BACHILLER'
    },
    {
      label: 'Neg pers no desea recibir llamadas de la utpl',
      value: 'NEG-PERS-NO-DESEA-RECIBIR-LLAMADAS-DE-LA-UTPL'
    },
    {
      label: 'Neg pers problemas de salud',
      value: 'NEG-PERS-PROBLEMAS-DE-SALUD'
    },
    {
      label: 'Negativa pers trabaja en la utpl',
      value: 'NEGATIVA-PERS-TRABAJA-EN-LA-UTPL'
    },
    {
      label: 'No desea continuar con su proceso de matrícula',
      value: 'NO-DESEA-CONTINUAR-CON-SU-PROCESO-DE-MATRICULA'
    },
    {
      label: 'Se matriculara en el siguiente ciclo',
      value: 'SE-MATRICULARA-EN-EL-SIGUIENTE-CICLO'
    }
  ],
  noContactoNoJustificado: [
    {
      label: 'Cne no contesta',
      value: 'CNE-NO-CONTESTA'
    }
  ]
}
