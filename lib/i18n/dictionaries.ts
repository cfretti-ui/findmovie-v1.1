import type { Locale } from "@/lib/i18n/locales";

type Dictionary = {
  nav: {
    about: string;
    premium: string;
    soon: string;
  };
  footer: {
    tagline: string;
    about: string;
    findMovie: string;
    language: string;
  };
  hero: {
    subtitle: string;
    description: string;
    findMovie: string;
    howItWorks: string;
  };
  home: {
    featuresTitle: string;
    featuresSubtitle: string;
    feature1Title: string;
    feature1Description: string;
    feature2Title: string;
    feature2Description: string;
    feature3Title: string;
    feature3Description: string;
    trendingTitle: string;
    trendingSubtitle: string;
    howTitle: string;
    howSubtitle: string;
    stepLabel: string;
    step1: string;
    step2: string;
    step3: string;
    findMovie: string;
    premiumEyebrow: string;
    premiumTitle: string;
    premiumDescription: string;
  };
  about: {
    eyebrow: string;
    intro: string;
    card1Title: string;
    card1Body: string;
    card2Title: string;
    card2Body: string;
    findMovie: string;
  };
  questionnaire: {
    previous: string;
    next: string;
    seeRecommendation: string;
    questionOf: string;
    adultLocked: string;
  };
  recommendation: {
    incompleteTitle: string;
    incompleteBody: string;
    continueQuestionnaire: string;
    back: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    yourRecommendation: string;
    yourMatch: string;
    another: string;
    watched: string;
    restart: string;
    why: string;
    whyTitle: string;
    whyIntro: string;
    alsoLike: string;
    loading: string;
    noResult: string;
    noResultSubtitle: string;
    error: string;
    viewDetails: string;
  };
  search: {
    placeholder: string;
    loading: string;
    empty: string;
    error: string;
    open: string;
  };
  movie: {
    runtime: string;
    director: string;
    cast: string;
    originalTitle: string;
    rating: string;
    votes: string;
    availableOn: string;
    overview: string;
    similar: string;
    notFound: string;
    backHome: string;
    minutes: string;
  };
  age: {
    all: string;
    "10": string;
    "12": string;
    "16": string;
    "18": string;
    unrated: string;
    adult: string;
  };
  carousel: {
    prev: string;
    next: string;
  };
  reasons: {
    genreMatch: string;
    moodMatch: string;
    energyMatch: string;
    intensityMatch: string;
    languageMatch: string;
    streamingMatch: string;
    durationMatch: string;
    periodMatch: string;
    iconic: string;
    hiddenGem: string;
    watchingWith: string;
    quality: string;
    fallback: string;
  };
  questions: {
    watchingWith: { title: string };
    mood: { title: string };
    genres: { title: string; description: string };
    energy: { title: string };
    duration: { title: string };
    intensity: { title: string };
    language: { title: string };
    streamingServices: { title: string; description: string };
    releasePeriod: { title: string };
    discovery: { title: string };
    maxAge: { title: string };
    allowAdult: { title: string; description: string };
  };
  options: Record<string, string>;
};

const en: Dictionary = {
  nav: {
    about: "About",
    premium: "Premium",
    soon: "soon",
  },
  footer: {
    tagline:
      "Your next favorite movie, matched to mood and streaming — in under a minute.",
    about: "About",
    findMovie: "Find a movie",
    language: "Language",
  },
  hero: {
    subtitle: "Your next favorite movie starts here.",
    description:
      "Discover movies perfectly matched to your mood, your favorite genres and your streaming services in under one minute.",
    findMovie: "Find a movie",
    howItWorks: "Discover how it works",
  },
  home: {
    featuresTitle: "Designed for the perfect night in",
    featuresSubtitle: "A calm, focused experience — no endless scrolling.",
    feature1Title: "Personalized recommendations",
    feature1Description: "Movies selected according to your preferences.",
    feature2Title: "Your streaming services",
    feature2Description:
      "Recommendations only from your available streaming platforms.",
    feature3Title: "Under one minute",
    feature3Description:
      "Answer a few questions and instantly discover your next movie.",
    trendingTitle: "Trending Tonight",
    trendingSubtitle: "A curated set of films people are watching right now.",
    howTitle: "How it works",
    howSubtitle: "Three quiet steps between you and your next favorite film.",
    stepLabel: "Step",
    step1: "Answer a few questions.",
    step2: "FindMovie analyzes your preferences.",
    step3: "Receive the perfect recommendation.",
    findMovie: "Find a movie",
    premiumEyebrow: "Premium",
    premiumTitle: "Coming soon",
    premiumDescription:
      "Deeper taste profiles, family modes, and smarter matches — without cluttering the experience you have today.",
  },
  about: {
    eyebrow: "About",
    intro:
      "FindMovie helps you stop browsing and start watching. A short, thoughtful questionnaire turns mood, company, and streaming services into one clear recommendation.",
    card1Title: "Built for real evenings",
    card1Body:
      "No endless lists. No noisy marketing. Just a calm path from “what should we watch?” to a film worth your time.",
    card2Title: "Ready for what comes next",
    card2Body:
      "The product is structured for TMDb data, smarter recommendation logic, accounts, and Premium — without rewriting the experience.",
    findMovie: "Find a movie",
  },
  questionnaire: {
    previous: "Previous",
    next: "Next",
    seeRecommendation: "See recommendation",
    questionOf: "Question {current} of {total}",
    adultLocked: "Adult content stays off in Family mode.",
  },
  recommendation: {
    incompleteTitle: "Finish the questionnaire first",
    incompleteBody:
      "Answer a few questions so we can match the right film to your mood.",
    continueQuestionnaire: "Continue questionnaire",
    back: "Back",
    eyebrow: "Your match",
    title: "Your next film",
    subtitle: "A film selected according to your answers.",
    yourRecommendation: "Your recommendation",
    yourMatch: "Your match",
    another: "Another recommendation",
    watched: "I've watched it",
    restart: "Restart questionnaire",
    why: "Why this film?",
    whyTitle: "Why we recommended {title}",
    whyIntro: "We recommended {title} because:",
    alsoLike: "You might also like",
    loading: "Finding the right film…",
    noResult: "No recommendation found",
    noResultSubtitle:
      "We couldn't find another film matching your preferences.",
    error: "We couldn’t find a match right now. Try again in a moment.",
    viewDetails: "View film",
  },
  search: {
    placeholder: "Search for a movie...",
    loading: "Searching…",
    empty: "No movies found.",
    error: "Search is temporarily unavailable.",
    open: "Search",
  },
  movie: {
    runtime: "Runtime",
    director: "Director",
    cast: "Cast",
    originalTitle: "Original title",
    rating: "TMDb rating",
    votes: "{count} votes",
    availableOn: "Available on",
    overview: "Overview",
    similar: "You might also like",
    notFound: "This film could not be found.",
    backHome: "Back to FindMovie",
    minutes: "{count} min",
  },
  age: {
    all: "All audiences",
    "10": "10+",
    "12": "12+",
    "16": "16+",
    "18": "18+",
    unrated: "Unrated",
    adult: "Adult content",
  },
  carousel: {
    prev: "Scroll left",
    next: "Scroll right",
  },
  reasons: {
    genreMatch: "It matches your genre picks: {genres}",
    moodMatch: "It fits the mood you chose: {mood}",
    energyMatch: "The pacing matches what you asked for: {energy}",
    intensityMatch: "The tone stays {intensity}",
    languageMatch: "It matches your {language} language preference",
    streamingMatch: "It’s available on {services}",
    durationMatch: "The runtime stays within the length you wanted",
    periodMatch: "It belongs to the period you selected",
    iconic: "It’s a widely loved, iconic title",
    hiddenGem: "It’s a less obvious pick that still fits your taste",
    watchingWith: "It works well when watching {watchingWith}",
    quality: "It has a strong audience rating",
    fallback: "It’s a critically acclaimed match for a memorable night in",
  },
  questions: {
    watchingWith: { title: "Who are you watching with?" },
    mood: { title: "What mood are you looking for?" },
    genres: {
      title: "Which genres appeal to you tonight?",
      description: "Pick one or more.",
    },
    energy: { title: "What pacing do you want?" },
    duration: { title: "Maximum duration" },
    intensity: { title: "How intense should it feel?" },
    language: { title: "Language preference" },
    streamingServices: {
      title: "Streaming services",
      description: "Select every platform you have access to.",
    },
    releasePeriod: { title: "Release period" },
    discovery: { title: "What kind of discovery do you want?" },
    maxAge: { title: "What is the maximum age rating?" },
    allowAdult: {
      title: "Adult content",
      description: "Off by default. Locked if you chose Family.",
    },
  },
  options: {
    Alone: "Alone",
    Partner: "Partner",
    Friends: "Friends",
    Family: "Family",
    Laugh: "Laugh",
    Think: "Think",
    Cry: "Cry",
    "Feel inspired": "Feel inspired",
    Adventure: "Adventure",
    "Be scared": "Be scared",
    Action: "Action",
    Comedy: "Comedy",
    Drama: "Drama",
    "Sci-Fi": "Sci-Fi",
    Thriller: "Thriller",
    Romance: "Romance",
    Horror: "Horror",
    Animation: "Animation",
    "Slow & atmospheric": "Slow & atmospheric",
    Balanced: "Balanced",
    "Fast & intense": "Fast & intense",
    "Under 90 minutes": "Under 90 minutes",
    "Under 2 hours": "Under 2 hours",
    "No preference": "No preference",
    "Family-friendly": "Family-friendly",
    Mild: "Mild",
    Mature: "Mature",
    "Any language": "Any language",
    English: "English",
    French: "French",
    Netflix: "Netflix",
    "Prime Video": "Prime Video",
    "Disney+": "Disney+",
    "Apple TV+": "Apple TV+",
    Max: "Max",
    "Canal+": "Canal+",
    Recent: "Recent",
    "2000+": "2000+",
    Classics: "Classics",
    "Something iconic": "Something iconic",
    "A hidden gem": "A hidden gem",
    "Surprise me": "Surprise me",
    all: "All audiences",
    "10": "10+",
    "12": "12+",
    "16": "16+",
    "18": "18+",
    true: "Allow adult content",
    "Science Fiction": "Science fiction",
    Crime: "Crime",
    Fantasy: "Fantasy",
    FamilyGenre: "Family",
    Mystery: "Mystery",
    Documentary: "Documentary",
    History: "History",
    Music: "Music",
    War: "War",
    Western: "Western",
  },
};

const fr: Dictionary = {
  nav: {
    about: "À propos",
    premium: "Premium",
    soon: "bientôt",
  },
  footer: {
    tagline:
      "Votre prochain film préféré, selon votre humeur et vos plateformes — en moins d’une minute.",
    about: "À propos",
    findMovie: "Trouver un film",
    language: "Langue",
  },
  hero: {
    subtitle: "Votre prochain film préféré commence ici.",
    description:
      "Découvrez des films parfaitement adaptés à votre humeur, vos genres favoris et vos services de streaming en moins d’une minute.",
    findMovie: "Trouver un film",
    howItWorks: "Découvrir comment ça marche",
  },
  home: {
    featuresTitle: "Pensé pour une soirée parfaite",
    featuresSubtitle: "Une expérience calme et précise — sans scroll infini.",
    feature1Title: "Recommandations personnalisées",
    feature1Description: "Des films choisis selon vos préférences.",
    feature2Title: "Vos services de streaming",
    feature2Description:
      "Des recommandations uniquement sur vos plateformes disponibles.",
    feature3Title: "En moins d’une minute",
    feature3Description:
      "Répondez à quelques questions et découvrez immédiatement votre prochain film.",
    trendingTitle: "Tendances ce soir",
    trendingSubtitle: "Une sélection de films que les gens regardent en ce moment.",
    howTitle: "Comment ça marche",
    howSubtitle: "Trois étapes simples jusqu’à votre prochain film préféré.",
    stepLabel: "Étape",
    step1: "Répondez à quelques questions.",
    step2: "FindMovie analyse vos préférences.",
    step3: "Recevez la recommandation parfaite.",
    findMovie: "Trouver un film",
    premiumEyebrow: "Premium",
    premiumTitle: "Bientôt disponible",
    premiumDescription:
      "Profils plus fins, modes famille et correspondances plus intelligentes — sans alourdir l’expérience actuelle.",
  },
  about: {
    eyebrow: "À propos",
    intro:
      "FindMovie vous aide à arrêter de chercher et à commencer à regarder. Un court questionnaire transforme humeur, compagnie et plateformes en une recommandation claire.",
    card1Title: "Conçu pour les vraies soirées",
    card1Body:
      "Pas de listes infinies. Pas de marketing bruyant. Juste un chemin calme de « on regarde quoi ? » à un film qui vaut le coup.",
    card2Title: "Prêt pour la suite",
    card2Body:
      "Le produit est prêt pour TMDb, une logique de recommandation plus intelligente, les comptes et Premium — sans tout réécrire.",
    findMovie: "Trouver un film",
  },
  questionnaire: {
    previous: "Précédent",
    next: "Suivant",
    seeRecommendation: "Voir la recommandation",
    questionOf: "Question {current} sur {total}",
    adultLocked: "Le contenu adulte reste désactivé en mode Famille.",
  },
  recommendation: {
    incompleteTitle: "Terminez d’abord le questionnaire",
    incompleteBody:
      "Répondez à quelques questions pour trouver le film adapté à votre humeur.",
    continueQuestionnaire: "Continuer le questionnaire",
    back: "Retour",
    eyebrow: "Votre sélection",
    title: "Votre prochain film",
    subtitle: "Un film sélectionné selon vos réponses.",
    yourRecommendation: "Votre recommandation",
    yourMatch: "Votre sélection",
    another: "Autre recommandation",
    watched: "Je l’ai déjà vu",
    restart: "Recommencer le questionnaire",
    why: "Pourquoi ce film ?",
    whyTitle: "Pourquoi nous avons recommandé {title}",
    whyIntro: "Nous avons recommandé {title} parce que :",
    alsoLike: "Vous pourriez aussi aimer",
    loading: "Recherche du bon film…",
    noResult: "Aucune recommandation trouvée",
    noResultSubtitle:
      "Nous n’avons pas trouvé d’autre film correspondant à vos préférences.",
    error: "Impossible de trouver une correspondance pour le moment.",
    viewDetails: "Voir la fiche",
  },
  search: {
    placeholder: "Rechercher un film...",
    loading: "Recherche…",
    empty: "Aucun film trouvé.",
    error: "La recherche est temporairement indisponible.",
    open: "Rechercher",
  },
  movie: {
    runtime: "Durée",
    director: "Réalisateur",
    cast: "Acteurs",
    originalTitle: "Titre original",
    rating: "Note TMDb",
    votes: "{count} votes",
    availableOn: "Disponible sur",
    overview: "Synopsis",
    similar: "Vous pourriez aussi aimer",
    notFound: "Ce film est introuvable.",
    backHome: "Retour à FindMovie",
    minutes: "{count} min",
  },
  age: {
    all: "Tous publics",
    "10": "10+",
    "12": "12+",
    "16": "16+",
    "18": "18+",
    unrated: "Non classé",
    adult: "Contenu adulte",
  },
  carousel: {
    prev: "Défiler vers la gauche",
    next: "Défiler vers la droite",
  },
  reasons: {
    genreMatch: "Il correspond à vos genres : {genres}",
    moodMatch: "Il correspond à l’humeur choisie : {mood}",
    energyMatch: "Le rythme correspond à votre choix : {energy}",
    intensityMatch: "Le ton reste {intensity}",
    languageMatch: "Il correspond à votre préférence de langue : {language}",
    streamingMatch: "Il est disponible sur {services}",
    durationMatch: "La durée reste dans la limite demandée",
    periodMatch: "Il appartient à la période sélectionnée",
    iconic: "C’est un titre iconique, largement apprécié",
    hiddenGem: "C’est une pépite moins évidente, toujours dans vos goûts",
    watchingWith: "Il convient bien pour regarder {watchingWith}",
    quality: "Il a une très bonne note du public",
    fallback: "C’est une correspondance solide pour une belle soirée",
  },
  questions: {
    watchingWith: { title: "Avec qui regardez-vous ?" },
    mood: { title: "Quelle humeur recherchez-vous ?" },
    genres: {
      title: "Quels genres vous tentent ce soir ?",
      description: "Choisissez-en un ou plusieurs.",
    },
    energy: { title: "Quel rythme préférez-vous ?" },
    duration: { title: "Durée maximale" },
    intensity: { title: "Quelle intensité souhaitez-vous ?" },
    language: { title: "Préférence de langue" },
    streamingServices: {
      title: "Services de streaming",
      description: "Sélectionnez toutes vos plateformes.",
    },
    releasePeriod: { title: "Période de sortie" },
    discovery: { title: "Quel type de découverte voulez-vous ?" },
    maxAge: { title: "Quel âge maximum ?" },
    allowAdult: {
      title: "Contenu adulte",
      description: "Désactivé par défaut. Verrouillé si vous avez choisi Famille.",
    },
  },
  options: {
    Alone: "Seul(e)",
    Partner: "En couple",
    Friends: "Entre amis",
    Family: "En famille",
    Laugh: "Rire",
    Think: "Réfléchir",
    Cry: "Émouvoir",
    "Feel inspired": "S’inspirer",
    Adventure: "Aventure",
    "Be scared": "Avoir peur",
    Action: "Action",
    Comedy: "Comédie",
    Drama: "Drame",
    "Sci-Fi": "Science-fiction",
    Thriller: "Thriller",
    Romance: "Romance",
    Horror: "Horreur",
    Animation: "Animation",
    "Slow & atmospheric": "Lent & atmosphérique",
    Balanced: "Équilibré",
    "Fast & intense": "Rapide & intense",
    "Under 90 minutes": "Moins de 90 minutes",
    "Under 2 hours": "Moins de 2 heures",
    "No preference": "Aucune préférence",
    "Family-friendly": "Tout public",
    Mild: "Modéré",
    Mature: "Mature",
    "Any language": "Toutes langues",
    English: "Anglais",
    French: "Français",
    Netflix: "Netflix",
    "Prime Video": "Prime Video",
    "Disney+": "Disney+",
    "Apple TV+": "Apple TV+",
    Max: "Max",
    "Canal+": "Canal+",
    Recent: "Récents",
    "2000+": "Années 2000+",
    Classics: "Classiques",
    "Something iconic": "Un film iconique",
    "A hidden gem": "Une pépite",
    "Surprise me": "Surprenez-moi",
    all: "Tous publics",
    "10": "10+",
    "12": "12+",
    "16": "16+",
    "18": "18+",
    true: "Autoriser le contenu adulte",
    "Science Fiction": "Science-fiction",
    Crime: "Crime",
    Fantasy: "Fantastique",
    FamilyGenre: "Famille",
    Mystery: "Mystère",
    Documentary: "Documentaire",
    History: "Histoire",
    Music: "Musique",
    War: "Guerre",
    Western: "Western",
  },
};

const es: Dictionary = {
  nav: {
    about: "Acerca de",
    premium: "Premium",
    soon: "pronto",
  },
  footer: {
    tagline:
      "Tu próxima película favorita, según tu humor y tus plataformas — en menos de un minuto.",
    about: "Acerca de",
    findMovie: "Buscar una película",
    language: "Idioma",
  },
  hero: {
    subtitle: "Tu próxima película favorita empieza aquí.",
    description:
      "Descubre películas perfectamente adaptadas a tu humor, tus géneros favoritos y tus servicios de streaming en menos de un minuto.",
    findMovie: "Buscar una película",
    howItWorks: "Descubrir cómo funciona",
  },
  home: {
    featuresTitle: "Diseñado para una noche perfecta",
    featuresSubtitle: "Una experiencia calmada y precisa — sin scroll infinito.",
    feature1Title: "Recomendaciones personalizadas",
    feature1Description: "Películas elegidas según tus preferencias.",
    feature2Title: "Tus servicios de streaming",
    feature2Description:
      "Recomendaciones solo de las plataformas que tienes disponibles.",
    feature3Title: "En menos de un minuto",
    feature3Description:
      "Responde unas preguntas y descubre al instante tu próxima película.",
    trendingTitle: "Tendencias esta noche",
    trendingSubtitle: "Una selección de películas que la gente está viendo ahora.",
    howTitle: "Cómo funciona",
    howSubtitle: "Tres pasos sencillos hasta tu próxima película favorita.",
    stepLabel: "Paso",
    step1: "Responde unas preguntas.",
    step2: "FindMovie analiza tus preferencias.",
    step3: "Recibe la recomendación perfecta.",
    findMovie: "Buscar una película",
    premiumEyebrow: "Premium",
    premiumTitle: "Próximamente",
    premiumDescription:
      "Perfiles más profundos, modos familiares y mejores coincidencias — sin complicar la experiencia actual.",
  },
  about: {
    eyebrow: "Acerca de",
    intro:
      "FindMovie te ayuda a dejar de buscar y empezar a ver. Un cuestionario breve convierte humor, compañía y plataformas en una recomendación clara.",
    card1Title: "Hecho para noches reales",
    card1Body:
      "Sin listas interminables. Sin marketing ruidoso. Solo un camino calmado de «¿qué vemos?» a una película que merezca la pena.",
    card2Title: "Listo para lo que viene",
    card2Body:
      "El producto está preparado para TMDb, una lógica de recomendación más inteligente, cuentas y Premium — sin reescribirlo todo.",
    findMovie: "Buscar una película",
  },
  questionnaire: {
    previous: "Anterior",
    next: "Siguiente",
    seeRecommendation: "Ver recomendación",
    questionOf: "Pregunta {current} de {total}",
    adultLocked: "El contenido adulto permanece desactivado en modo Familia.",
  },
  recommendation: {
    incompleteTitle: "Termina primero el cuestionario",
    incompleteBody:
      "Responde unas preguntas para encontrar la película adecuada a tu humor.",
    continueQuestionnaire: "Continuar el cuestionario",
    back: "Volver",
    eyebrow: "Tu selección",
    title: "Tu próxima película",
    subtitle: "Una película seleccionada según tus respuestas.",
    yourRecommendation: "Tu recomendación",
    yourMatch: "Tu selección",
    another: "Otra recomendación",
    watched: "Ya la he visto",
    restart: "Reiniciar el cuestionario",
    why: "¿Por qué esta película?",
    whyTitle: "Por qué recomendamos {title}",
    whyIntro: "Recomendamos {title} porque:",
    alsoLike: "También te puede gustar",
    loading: "Buscando la película adecuada…",
    noResult: "No se ha encontrado ninguna recomendación",
    noResultSubtitle:
      "No hemos encontrado otra película que coincida con tus preferencias.",
    error: "No hemos podido encontrar una coincidencia ahora mismo.",
    viewDetails: "Ver ficha",
  },
  search: {
    placeholder: "Buscar una película...",
    loading: "Buscando…",
    empty: "No se han encontrado películas.",
    error: "La búsqueda no está disponible temporalmente.",
    open: "Buscar",
  },
  movie: {
    runtime: "Duración",
    director: "Director",
    cast: "Reparto",
    originalTitle: "Título original",
    rating: "Nota TMDb",
    votes: "{count} votos",
    availableOn: "Disponible en",
    overview: "Sinopsis",
    similar: "También te puede gustar",
    notFound: "No se ha encontrado esta película.",
    backHome: "Volver a FindMovie",
    minutes: "{count} min",
  },
  age: {
    all: "Todos los públicos",
    "10": "10+",
    "12": "12+",
    "16": "16+",
    "18": "18+",
    unrated: "Sin clasificar",
    adult: "Contenido adulto",
  },
  carousel: {
    prev: "Desplazar a la izquierda",
    next: "Desplazar a la derecha",
  },
  reasons: {
    genreMatch: "Coincide con tus géneros: {genres}",
    moodMatch: "Encaja con el humor que elegiste: {mood}",
    energyMatch: "El ritmo coincide con lo que pediste: {energy}",
    intensityMatch: "El tono se mantiene {intensity}",
    languageMatch: "Coincide con tu preferencia de idioma: {language}",
    streamingMatch: "Está disponible en {services}",
    durationMatch: "La duración se mantiene en el límite elegido",
    periodMatch: "Pertenece al periodo que seleccionaste",
    iconic: "Es un título icónico y muy querido",
    hiddenGem: "Es una joya menos evidente que encaja con tu gusto",
    watchingWith: "Funciona bien para verla {watchingWith}",
    quality: "Tiene una nota alta del público",
    fallback: "Es una coincidencia sólida para una gran noche",
  },
  questions: {
    watchingWith: { title: "¿Con quién vas a verla?" },
    mood: { title: "¿Qué humor buscas?" },
    genres: {
      title: "¿Qué géneros te apetecen esta noche?",
      description: "Elige uno o varios.",
    },
    energy: { title: "¿Qué ritmo prefieres?" },
    duration: { title: "Duración máxima" },
    intensity: { title: "¿Qué intensidad quieres?" },
    language: { title: "Preferencia de idioma" },
    streamingServices: {
      title: "Servicios de streaming",
      description: "Selecciona todas tus plataformas.",
    },
    releasePeriod: { title: "Periodo de estreno" },
    discovery: { title: "¿Qué tipo de descubrimiento quieres?" },
    maxAge: { title: "¿Cuál es la edad máxima?" },
    allowAdult: {
      title: "Contenido adulto",
      description: "Desactivado por defecto. Bloqueado si elegiste Familia.",
    },
  },
  options: {
    Alone: "Solo/a",
    Partner: "En pareja",
    Friends: "Con amigos",
    Family: "En familia",
    Laugh: "Reír",
    Think: "Pensar",
    Cry: "Emocionarme",
    "Feel inspired": "Inspirarme",
    Adventure: "Aventura",
    "Be scared": "Asustarme",
    Action: "Acción",
    Comedy: "Comedia",
    Drama: "Drama",
    "Sci-Fi": "Ciencia ficción",
    Thriller: "Thriller",
    Romance: "Romance",
    Horror: "Terror",
    Animation: "Animación",
    "Slow & atmospheric": "Lento y atmosférico",
    Balanced: "Equilibrado",
    "Fast & intense": "Rápido e intenso",
    "Under 90 minutes": "Menos de 90 minutos",
    "Under 2 hours": "Menos de 2 horas",
    "No preference": "Sin preferencia",
    "Family-friendly": "Para toda la familia",
    Mild: "Suave",
    Mature: "Maduro",
    "Any language": "Cualquier idioma",
    English: "Inglés",
    French: "Francés",
    Netflix: "Netflix",
    "Prime Video": "Prime Video",
    "Disney+": "Disney+",
    "Apple TV+": "Apple TV+",
    Max: "Max",
    "Canal+": "Canal+",
    Recent: "Recientes",
    "2000+": "Años 2000+",
    Classics: "Clásicos",
    "Something iconic": "Algo icónico",
    "A hidden gem": "Una joya oculta",
    "Surprise me": "Sorpréndeme",
    all: "Todos los públicos",
    "10": "10+",
    "12": "12+",
    "16": "16+",
    "18": "18+",
    true: "Permitir contenido adulto",
    "Science Fiction": "Ciencia ficción",
    Crime: "Crimen",
    Fantasy: "Fantasía",
    FamilyGenre: "Familiar",
    Mystery: "Misterio",
    Documentary: "Documental",
    History: "Historia",
    Music: "Música",
    War: "Guerra",
    Western: "Western",
  },
};

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  fr,
  es,
};

export type { Dictionary };
