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
        overflowX: 'auto', // Alterado para 'auto' ou 'scroll'
        overflowY: 'hidden', // Para ocultar a barra de rolagem vertical
        whiteSpace: 'nowrap', // Impede que os elementos filhos quebrem para a próxima linha
        filter: isDragging ? 'blur(2px)' : 'none',
        textAlign: 'center', // Centraliza os itens
        }}
    >
        {children}
    </div>
  )
}
