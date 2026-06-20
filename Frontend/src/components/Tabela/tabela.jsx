import { Container, Table } from "react-bootstrap"
import style from "./tabela.module.css"

const Tabela = ({ rows, columns, keyField, handleSelected }) => {
    const temDados = rows && rows.length > 0
    return (
        <Container fluid>

            <Table className={style.tabela} responsive hover>
                <thead>
                    <tr>
                        {columns.map(column => (
                            <td className={style.tabelaHeader} key={column.accessor}>
                                {column.header}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {temDados ? (

                        rows.map(row => (
                            <tr style={{cursor: "pointer"}} onClick={() => handleSelected(row)} key={row[keyField]}>
                                {columns.map(column => (
                                    <td key={column.accessor}>{column.render ? column.render(row) : row[column.accessor]}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <td colSpan={columns.length} className="text-center text-muted">Sem dados</td>
                    )}
                </tbody>
            </Table>
        </Container>
    )
}

export default Tabela