const path = require('path');
const fs = require('fs');
const express = require('express');
const soap = require('soap');

const pedidosStore = {};

const serviceDefinition = {
  TransportadorService: {
    TransportadorPort: {
      RegistrarPedido(args, callback) {
        const pedido = args.pedido;
        const numero = pedido.numeroPedido;

        pedidosStore[numero] = {
          dados: pedido,
          status: 'Aguardando coleta',
        };

        console.log(`Pedido registrado: ${numero}`, pedidosStore[numero]); // CHANGED
        return callback(null, {
          resposta: {
            sucesso: true,
            mensagem: `Pedido ${numero} registrado com sucesso.`,
          }
        });
      },

      ConsultarStatus(args, callback) {
        const numero = args.numeroPedido;
        const registro = pedidosStore[numero];
        
        if (!registro) {
          console.warn(`Consulta status para pedido não existente: ${numero}`);
          return callback(null, {
            status: {
              numeroPedido: numero,
              status: 'Pedido não encontrado',
            }
          });
        }

        console.log(`Status consultado: ${numero} -> ${registro.status}`);
        return callback(null, {
          status: {
            numeroPedido: numero,
            status: registro.status,
          }
        });
      },

      AtualizarStatus(args, callback) {
        const numero = args.numeroPedido;
        const novoStatus = args.novoStatus;
        const registro = pedidosStore[numero];

        if (!registro) {
          console.error(`Falha ao atualizar status para pedido não existente: ${numero}`);
          return callback(null, {
            resposta: {
              sucesso: false,
              mensagem: `Pedido ${numero} não encontrado.`,
            }
          });
        }

        registro.status = novoStatus;
        console.log(`Status atualizado: ${numero} -> ${novoStatus}`);

        return callback(null, {
          resposta: {
            sucesso: true,
            mensagem: `Status do pedido ${numero} atualizado para '${novoStatus}'.`,
          }
        });
      }
    }
  }
};

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/debug', (req, res) => {
  res.json(pedidosStore);
});

const wsdlPath = path.join(__dirname, '..', 'wsdl', 'transportador.wsdl');
const wsdlXml = fs.readFileSync(wsdlPath, 'utf8');

const server = app.listen(PORT, function() {
  soap.listen(app, '/soap', serviceDefinition, wsdlXml);
  console.log(`Servidor SOAP rodando em http://localhost:${PORT}/soap?wsdl`);
});
