const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`API aguardando conexoes na porta ${port}`);
});

const db = new sqlite3.Database("produtos.db", (erro) => {
    if(erro){
        console.log(`Falha ao abrir o banco de dados: ${erro.message}`);
    } else {
        db.run("CREATE TABLE IF NOT EXISTS produtos( \
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
            nome TEXT NOT NULL, \
            preco DECIMAL(7, 2), \
            estoque INTEGER);", ((erro) => {
                if(erro)
                    console.log("Erro no comando de criação da tabela");
            }));
    }
})

app.get("/produtos", (req, res) => {
    const comando = "SELECT * FROM produtos";
    db.all(comando, [], (erro, resultado) => {
        if (erro) {
            res.statusCode(400).json({"erro" : erro.message});
        } else {
            res.statusCode(200).json(resultado);
        }
    })
});