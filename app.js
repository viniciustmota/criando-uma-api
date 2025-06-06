const sqlite3 = require('sqlite3');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 8080;

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

// Método GET - Obter todos os produtos cadastrados
app.get("/produtos", (req, res) => {
    const comando = "SELECT * FROM produtos";
    db.all(comando, [], (erro, resultado) => {
        if (erro) {
            res.status(400).json({"erro" : erro.message});
        } else {
            res.status(200).json(resultado);
        }
    })
});

// Método GET  para obter os dados de um produto específico
app.get("/produtos/:id", (requisicao, resposta)=> {
    db.get("SELECT * FROM produtos WHERE id = ?", [requisicao.params.id],
        (erro, resultado) => {
            if(erro){
                resposta.status(404).json({"erro": erro.message});
            }else{
                resposta.status(200).json({resultado});
            }
        }
    )
});

// Método POST - Incluir um novo produto
app.post("/produtos", (requisicao, resposta) => {
    db.run("INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)",
        [requisicao.body.nome, requisicao.body.preco, requisicao.body.estoque],
        (erro, resultado) => {
            if(erro) {
                resposta.status(400).json({"erro": erro.message});
            }else{
                resposta.status(201).json({"incluido": true});
            }
        }
     )
})

// Método PUT - Alterar os dados de um produto
app.put("/produtos/:id", (requisicao, resposta) => {
    db.run("UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?",
    [requisicao.body.nome, requisicao.body.preco, requisicao.body.estoque, requisicao.params.id],
    (erro, resultado) => {
        if(erro){
            resposta.status(400).json({"erro": erro.massage});
        }else{
            resposta.status(200).json({"alterado": true});
        }
    }
    )
})

// Método DELETE 
app.delete("/produtos/:id", (requisicao, resposta) => {
    db.run("DELETE FROM produtos WHERE id = ?", [requisicao.params.id],
    (erro) => {
        if(erro){
            resposta.status(404).json({"erro": erro.message})
        }else{
            resposta.status(200).json({"excluido": true});
        }
    }
)
});