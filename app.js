const express = require("express");
const path = require("path");
const mysql = require("mysql2");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "mvc/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const db = mysql.createConnection({
    host: "10.111.4.30",
    user: "dev1b",
    password: "Sen4i2024",
    database: "dev1b"
});


db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados: ", err);
        return;
    }
    console.log("Conectado ao banco de dados MySQL");
});

app.get("/", (req, res) => {
    res.render("index", {
        nome: "sidney",
        texto: "Demonstração"
    });
});


app.get("/home", (req, res) => {
    res.render("home", { mensagem: "Bem-vindo à página inicial!" });
});

app.get("/cadastro", (req, res) => {
    res.render("cadastro", { mensagem: "Bem-vindo à página inicial!"});
});



app.post("/login", (req, res) => {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        return res.render("error", { mensagem: "Preencha todos os campos" });
    }
    
    const query = "SELECT senha FROM GU_usuarios WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("Erro na consulta: ", err);
            return res.render("error", { mensagem: "Erro no servidor" });
        }
        
        if (results.length > 0) {
            const senhaDB = results[0].senha;
            if (senha === senhaDB) {
                res.redirect("home");
            } else {
                res.render("error", { mensagem: "Senha incorreta" });
            }
        } else {
            res.render("error", { mensagem: "Email não encontrado" });
        }
    });
});

app.post('/cadastrar', async (req, res) => {

    console.log(req.body)
    const { nome, email, senha } = req.body

    const sql = "insert into GU_usuarios (nome, email, senha, criado_em) values (? , ? , ?, ?)"

    const [rows] = await connection.execute(sql, [nome, email, senha, new Date()])

    res.json({
        msg: rows
    })

})

app.listen(3000, () => console.log("Servidor Online"));
