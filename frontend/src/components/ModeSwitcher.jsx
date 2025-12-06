import { useColorScheme } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import ComputerIcon from '@mui/icons-material/Computer'

function ModeSwitcher({ sx }) {
  const { mode, setMode } = useColorScheme()

  const handleModeChange = (event) => {
    setMode(event.target.value)
  }

  if (!mode) {
    return null
  }

  const getModeIcon = () => {
    switch (mode) {
    case 'light':
      return <LightModeIcon fontSize='small' />
    case 'dark':
      return <DarkModeIcon fontSize='small' />
    case 'system':
      return <ComputerIcon fontSize='small' />
    default:
      return <LightModeIcon fontSize='small' />
    }
  }

  return (
    <FormControl>
      <Select
        labelId='mode-select-label'
        id='mode-select'
        value={mode}
        onChange={handleModeChange}
        sx={{
          color: 'trello.icon',
          minWidth: 'auto',
          // width: '40px',
          fontSize: { xs: '0.75rem', sm: '1rem' },
          '& .MuiSelect-select': {
            paddingRight: '0 !important',
            paddingLeft: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          ...sx
        }}
        variant='standard'
        disableUnderline={true}
        IconComponent={() => null}
        renderValue={() => getModeIcon()}
      >
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightModeIcon fontSize='small'/> Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeIcon fontSize='small'/> Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ComputerIcon fontSize='small'/> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default ModeSwitcher
