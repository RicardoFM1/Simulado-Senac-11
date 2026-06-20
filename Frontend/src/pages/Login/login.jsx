import style from "./login.module.css"
import imagemCasamento from "../../assets/imagemCasamento.png"
import logoCasamento from "../../assets/logoCasamento.png"
import { Button, Form, InputGroup, Stack } from "react-bootstrap"
import { MdAttachEmail } from "react-icons/md";
import { useEffect, useState } from "react";
import { MdPassword } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Api from "../../service/api";
import { useNavigate } from "react-router";


const Login = () => {
    const [formData, setFormData] = useState({ email: "", senha: "" })
    const [mostrarSenha, setMostrarSenha] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (!name) console.log('Sem nome no campo')

        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await Api.post('/usuario/login', formData)

            if (res.status === 200) {
                toast.success(res.data.mensagem || 'Usuário logado com sucesso')
                localStorage.clear();
                localStorage.setItem('token', res.data?.token)
                navigate('/')
            }
        } catch (err) {
            const erros = err.response.data?.erros

            if (erros) {
                Object.values(erros).forEach((msg) => {
                    toast.error(msg)
                })
            } else {
                toast.error(err.response.data?.mensagem)
            }
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/')
        }
    }, [])
    return (
        <div className={style.divLogin}>

            <div className={style.divFoto}>
                <img src={imagemCasamento} alt="Imagem casamento" className={style.foto} />
            </div>

            <div className={style.divForm}>
                <img src={logoCasamento} alt="Logo casamento" className={style.logo} />
                <h1>Senac Wedding</h1>
                <h5>Seu portal de casamentos</h5>
                <hr className="w-75" />
                <Form className="w-75" onSubmit={handleSubmit}>
                    <Stack gap={4}>

                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><MdAttachEmail />
                                </InputGroup.Text>
                                <Form.Control
                                    value={formData.email}
                                    name="email"
                                    placeholder="Seu melhor email"
                                    required
                                    onChange={handleChange}
                                    type="email"
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Senha</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><MdPassword />

                                </InputGroup.Text>
                                <Form.Control
                                    value={formData.senha}
                                    name="senha"
                                    placeholder="Sua senha mais segura"
                                    required
                                    onChange={handleChange}
                                    type={mostrarSenha ? 'text' : 'password'}
                                />
                                <Button className="bg-transparent border" onClick={() => setMostrarSenha(!mostrarSenha)}>{mostrarSenha ? <FaEye color="black" /> : <FaEyeSlash color="black" />}</Button>
                            </InputGroup>
                        </Form.Group>
                        <Button type="submit" className={style.btnSubmit}>Login</Button>
                    </Stack>
                </Form>
            </div>
        </div>
    )
}

export default Login