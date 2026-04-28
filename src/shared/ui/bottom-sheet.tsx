// import { Box, Drawer } from '@mui/material'
// import type { ReactNode } from 'react'

// interface BottomSheetProps {
//   open: boolean
//   onClose: () => void
//   children: ReactNode
// }

// export const BottomSheet = ({ open, onClose, children }: BottomSheetProps) => {
//   return (
//     <Drawer
//       anchor="bottom"
//       open={open}
//       onClose={onClose}
//       elevation={0}
//       transitionDuration={{ enter: 280, exit: 220 }}
//       slotProps={{
//         backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.35)' } },
//         paper: {
//           elevation: 0,
//           sx: {
//             borderTopLeftRadius: 16,
//             borderTopRightRadius: 16,
//             maxHeight: '85vh',
//             overflow: 'hidden',
//           },
//         },
//       }}
//     >
//       <Box sx={{ pb: 2, px: 0, overflow: 'auto', maxHeight: '85vh' }}>
//         <Box
//           sx={{
//             position: 'sticky',
//             top: 0,
//             zIndex: 'layoutHigh',
//             backgroundColor: (theme) => theme.palette.common.white,
//             width: '100%',
//             pt: 1.5,
//             pb: 2,
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//         >
//           <Box
//             sx={{
//               width: 80,
//               height: 4,
//               borderRadius: 5,
//               backgroundColor: 'divider',
//             }}
//             aria-hidden
//           />
//         </Box>
//         {children}
//       </Box>
//     </Drawer>
//   )
// }
