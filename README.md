
# Título do Projeto

Comandos para rodar:

Na pasta do projeto:
cd .\compras\
npm install
cd ..
cd .\transportador\
npm install

node .\src\server.js
NOVO TERMINAL
node .\compras\src\client.js

O sistema ira registrar o pedido:

```
pedido: {
      numeroPedido: '12345',
      itens: JSON.stringify(['itemA', 'itemB']),
      quantidades: JSON.stringify([2, 5]),
      endereco: 'Rua Exemplo, 100',
      destinatario: 'João Silva'
    }
```

Mostrar o status:

``` 
Status do pedido: { numeroPedido: '12345', status: 'Aguardando coleta' }
```

E atualizá-lo:

```
Resposta AtualizarStatus: {
  sucesso: 'true',
  mensagem: "Status do pedido 12345 atualizado para 'Em transporte'."
}
```