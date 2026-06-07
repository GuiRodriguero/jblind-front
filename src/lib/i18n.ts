import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const resources = {
  pt: {
    translation: {
      default: {
        success: 'Sucesso!',
        loading: 'Carregando...',
        emptyResult: 'Nenhum resultado encontrado',
      },
      sidebar: {
        tournaments: 'Torneios',
        settings: 'Configurações',
      },
      home: {
        welcome: 'Bem-vindo ao JBlind',
        welcomeCaption: 'Selecione uma opção no menu lateral para começar.',
      },
      tournament: {
        title: 'Torneios',
        description: 'Gerencie seus home games e analise eventos passados.',
        newTournament: 'Novo Torneio',
        table: {
          name: 'Nome do Torneio',
          dateTime: 'Data e Hora',
          players: 'Jogadores',
          buyIn: 'Buy-In',
          action: 'Ação',
          empty: 'Nenhum torneio encontrado. Clique em "New Tournament" para começar.',
          button: {
            start: {
              title: 'Iniciar Torneio',
            },
          },
        },
        new: {
          create: 'Criar Novo Torneio',
          generalSettingsTitle: 'Configurações Gerais',
          name: 'Nome do Torneio',
          date: 'Data',
          time: 'Hora',
          expectedPlayers: 'Jogadores Esperados',
          buyInAmount: 'Valor do Buy-In (R$)',
          startingChips: 'Stack Inicial (Fichas)',
          allowRebuys: 'Permitir Rebuys',
          allowAddOns: 'Permitir Add-Ons',
          next: 'Próximo',
          save: 'Salvar Torneio',
          placeholder: {
            name: 'Ex.: Sexta do Poker',
            players: 'Ex.: 8',
            buyIn: 'Ex.: R$50',
            startingChips: 'Ex.: 1000',
          },
          level: {
            addBreak: 'Adicionar Intervalo',
            addLevel: 'Adicionar Level',
            duration: 'Duração',
            break: 'Intervalo',
            colorUp: 'Color Up',
            empty: 'Nenhum nível configurado. Clique em "Add Level" para iniciar a estrutura.',
          },
          generalSettings: {
            stepTitle: 'Passo 1: Configurações Gerais & Buy-in',
            title: 'Configurações Gerais',
          },
          blindStructure: {
            stepTitle: 'Step 2: Estrutura de Blind',
            title: 'Levels & Intervalos',
          },
        },
      },
      timer: {
        loading: 'Carregando torneio...',
        notFound: 'Torneio não encontrado',
        currentBlinds: 'Blinds Atuais',
        nextBlinds: 'Próximos Blinds',
        nextBreakIn: 'Próximo intervalo em',
        break: 'Intervalo',
        removeLowChips: 'Remova fichas de valores menores',
        playersTitle: 'Jogadores',
        playersLeft: 'Restantes',
        player: 'Jogador',
        seat: 'Assento',
        chips: 'Fichas',
        freeTournament: 'Torneio Grátis',
        prizePool: 'Premiação',
        structure: 'Estrutura',
      },
    },
  },
  en: {
    translation: {
      default: {
        success: 'Success!',
        loading: 'Loading...',
        emptyResult: 'No results found',
        cancel: 'Cancel',
      },
      sidebar: {
        tournaments: 'Tournaments',
        settings: 'Settings',
      },
      home: {
        welcome: 'Welcome to JBlind',
        welcomeCaption: 'Select an option on the sidebar to start.',
      },
      tournament: {
        title: 'Tournaments',
        description: 'Manage your home games and track past events.',
        newTournament: 'New Tournament',
        table: {
          name: 'Tournament Name',
          dateTime: 'Date & Time',
          players: 'Players',
          buyIn: 'Buy-In',
          action: 'Action',
          empty: 'No tournaments found. Click in "New Tournament" to start.',
          button: {
            start: {
              title: 'Start Tournament',
            },
          },
        },
        new: {
          create: 'Create New Tournament',
          generalSettingsTitle: 'General Settings',
          name: 'Tournament Name',
          date: 'Date',
          time: 'Time',
          expectedPlayers: 'Expected Players',
          buyInAmount: 'Buy-In Amount ($)',
          startingChips: 'Starting Stack (Chips)',
          allowRebuys: 'Allow Rebuys',
          allowAddOns: 'Allow Add-Ons',
          next: 'Next Step',
          save: 'Save Tournament',
          placeholder: {
            name: 'Eg.: Friday Night Poker',
            players: 'Eg.: 8',
            buyIn: 'Eg.: $50',
            startingChips: 'Eg.: 1000',
          },
          level: {
            addBreak: 'Add Break',
            addLevel: 'Add Level',
            duration: 'Duration',
            break: 'Break',
            colorUp: 'Color Up',
            empty: 'No levels configured. Click "Add Level" configure your levels.',
          },
          generalSettings: {
            stepTitle: 'Step 1: General Details & Buy-in',
            title: 'General Settings',
          },
          blindStructure: {
            stepTitle: 'Step 2: Blind Structure',
            title: 'Levels & Intervals',
          },
        },
      },
      timer: {
        loading: 'Loading tournament...',
        notFound: 'Tournament not found',
        currentBlinds: 'Current Blinds',
        nextBlinds: 'Next Blinds',
        nextBreakIn: 'Next break in',
        break: 'Break',
        removeLowChips: 'Remove low chips',
        playersTitle: 'Players',
        playersLeft: 'Left',
        player: 'Player',
        seat: 'Seat',
        chips: 'Chips',
        freeTournament: 'Free tournament',
        prizePool: 'Prize Pool',
        structure: 'Structure',
        entrants: 'Entrants',
        remaining: 'Remaining',
        chipsInPlay: 'Chips in Play',
        averageStack: 'Average Stack',
      },
    },
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
