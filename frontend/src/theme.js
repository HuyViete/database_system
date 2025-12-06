import { extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  colorSchemeSelector: 'class',
  defaultColorScheme: 'light', // Force light mode by default to match Trello's standard look
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#0052CC', // Atlassian Blue
          dark: '#0065FF',
          header: '#ffffff',
          contrastText: '#FFFFFF'
        },
        text: {
          primary: '#172B4D', // Atlassian Dark Gray
          secondary: '#5E6C84'
        },
        background: {
          default: '#F9FAFC', // Light gray background like Trello login
          paper: '#FFFFFF'
        },
        action: {
          hover: 'rgba(9, 30, 66, 0.08)'
        },
        // Custom Trello-like colors
        trello: {
          appBar: '#026aa7',
          appBarText: '#ffffff',
          boardBg: '#0079bf',
          listBg: '#ebecf0',
          cardBg: '#ffffff',
          cardHover: '#f4f5f7',
          textMain: '#172B4D',
          textSecondary: '#5e6c84',
          icon: '#42526e',
          border: '#091e4240',
          commentPanelBg: '#e1e6ee',
          commentPanelBorder: '#2c343d',
          commentInputBg: '#f0f2f5',
          inputBg: '#FAFBFC',
          inputBorder: '#DFE1E6',
          inputBorderHover: '#A6C5E2',
          navBg: '#ffffff',
          navText: '#172B4D',
          navItemBg: 'rgba(9, 30, 66, 0.08)',
          navItemActiveColor: '#0052CC',
          navItemActiveBg: '#E9F2FF',
          createBoardBg: '#F0F2F5',
          createBoardHover: '#E4E6EA',
          // Board specific colors (transparent overlays)
          boardHeaderBg: 'rgba(0,0,0,0.15)',
          boardButtonHover: 'rgba(255,255,255,0.2)',
          boardButtonActive: 'rgba(255,255,255,0.3)',
          boardListAddBg: 'rgba(255,255,255,0.24)',
          boardListAddHover: 'rgba(255,255,255,0.32)',
          scrollTrack: 'rgba(0,0,0,0.15)',
          scrollThumb: 'rgba(255,255,255,0.4)',
          scrollThumbHover: 'rgba(255,255,255,0.6)',
          modalBg: '#f4f5f7'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#579DFF',
          header: '#1D2125',
          contrastText: '#1D2125'
        },
        background: {
          default: '#1D2125',
          paper: '#22272B'
        },
        text: {
          primary: '#B6C2CF',
          secondary: '#9FADBC'
        },
        divider: '#39424a',
        trello: {
          appBar: '#1D2125',
          appBarText: '#9FADBC',
          boardBg: '#1D2125',
          listBg: '#101204',
          cardBg: '#22272B',
          cardHover: '#2C333A',
          textMain: '#B6C2CF',
          textSecondary: '#9FADBC',
          icon: '#9FADBC',
          border: '#39424a',
          commentPanelBg: '#1b2026',
          commentPanelBorder: '#c5ccd6',
          commentInputBg: '#22272B',
          inputBg: '#22272B',
          inputBorder: '#738496',
          inputBorderHover: '#8590A2',
          navBg: '#1D2125',
          navText: '#9FADBC',
          navItemBg: '#1c2b41',
          navItemActiveColor: '#579DFF',
          navItemActiveBg: '#1c2b41',
          createBoardBg: '#282e33',
          createBoardHover: '#333c43',
          // Board specific colors (transparent overlays)
          boardHeaderBg: 'rgba(0,0,0,0.15)',
          boardButtonHover: 'rgba(255,255,255,0.2)',
          boardButtonActive: 'rgba(255,255,255,0.3)',
          boardListAddBg: 'rgba(255,255,255,0.24)',
          boardListAddHover: 'rgba(255,255,255,0.32)',
          scrollTrack: 'rgba(0,0,0,0.15)',
          scrollThumb: 'rgba(255,255,255,0.4)',
          scrollThumbHover: 'rgba(255,255,255,0.6)',
          modalBg: '#2b2b2b'
        }
      }
    }
  },
  shape: {
    borderRadius: 3
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600
    },
    h4: {
      fontWeight: 700,
      color: '#172B4D'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          },
          padding: '8px 16px'
        },
        containedPrimary: {
          backgroundColor: '#4365DF',
          '&:hover': {
            backgroundColor: '#0065FF'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.trello.inputBg,
          '&.Mui-focused': {
            backgroundColor: theme.vars.palette.trello.inputBg
          },
          '&:hover': {
            backgroundColor: theme.vars.palette.trello.inputBg
          },
          '& fieldset': {
            borderColor: theme.vars.palette.trello.inputBorder
          },
          '&:hover fieldset': {
            borderColor: theme.vars.palette.trello.inputBorderHover
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.vars.palette.primary.main,
            borderWidth: '2px'
          },
          '& input': {
            padding: '10px 12px',
            color: theme.vars.palette.text.primary // Ensure text color matches the theme
          }
        })
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.vars.palette.text.secondary
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#6b6b6b #2b2b2b',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: '#2b2b2b',
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#6b6b6b',
            minHeight: 24,
            border: '3px solid #2b2b2b'
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
            backgroundColor: '#959595'
          },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#959595'
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#959595'
          },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: '#2b2b2b'
          }
        }
      }
    }
  }
})

export default theme
