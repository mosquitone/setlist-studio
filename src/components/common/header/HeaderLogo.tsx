import Box from '@mui/material/Box'
import Link from 'next/link'

export function HeaderLogo() {
  return (
    <Link href="/" passHref>
      <Box
        component="img"
        src="/MQT_LOGO_BLACK.png"
        alt="Logo"
        sx={{ height: 40, cursor: 'pointer' }}
      />
    </Link>
  )
}
