
export enum type {
  developpement_web = 'Développement Web',
  developpement_mobile = 'Développement Mobile',
  intelligence_artificielle = 'Intelligence Artificielle',
  bases_de_donnees = 'Bases de Données',
  securite_informatique = 'Sécurité Informatique',
  reseaux = 'Réseaux',
  systemes_embarques = 'Systèmes Embarqués',
  analyse_de_donnees = 'Analyse de Données',
  administration_systemes = 'Administration Systèmes',
  devops = 'DevOps'
}

export interface Question {
  questionText: string;
  bonneReponse: string;
  evaluationId: number;  // Correspond à l'évaluation liée
  options: string[];  // Liste d'options pour la question
}
