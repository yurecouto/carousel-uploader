import { ReactNode } from "react"

interface IScrollProps {
    isDragging: boolean, 
    children: ReactNode
}

export default function Scroll({isDragging, children}: IScrollProps ) {
  return (
    <div
        id={"scroll-image"}
        style={{
        overflowX: 'auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        filter: isDragging ? "blur(2px)": "none"
        }}
    >
        {children}
    </div>
  )
}
