import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import soap from 'soap';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const wsdlUrl = join(__dirname, '..', 'wsdl', 'transportador.wsdl');

async function main() {
  const client = await soap.createClientAsync(wsdlUrl);
  client.setEndpoint('http://localhost:3000/soap');

  let sair = false;
  while (!sair) {
    const { opcao } = await inquirer.prompt({
      type: 'list',
      name: 'opcao',
      message: 'Escolha uma opção:',
      choices: [
        { name: '1 - Registrar pedido', value: 'registrar' },
        { name: '2 - Consultar pedido',    value: 'consultar' },
        { name: '3 - Atualizar status',     value: 'atualizar' },
        { name: 'Sair',                     value: 'sair' }
      ]
    });

    switch (opcao) {
      case 'registrar':
        await registrarPedido(client);
        break;
      case 'consultar':
        await consultarPedido(client);
        break;
      case 'atualizar':
        await atualizarStatus(client);
        break;
      case 'sair':
        sair = true;
        console.log('Encerrando o programa.');
        break;
    }
  }
}

async function registrarPedido(client) {
  const itens = [];
  const quantidades = [];
  let adicionando = true;

  while (adicionando) {
    const { item, quantidade, mais } = await inquirer.prompt([
      {
        type: 'input',
        name: 'item',
        message: 'Nome do item:'
      },
      {
        type: 'number',
        name: 'quantidade',
        message: 'Quantidade:'
      },
      {
        type: 'confirm',
        name: 'mais',
        message: 'Deseja adicionar mais um item?',
        default: false
      }
    ]);
    itens.push(item);
    quantidades.push(quantidade);
    adicionando = mais;
  }

  const { numeroPedido, endereco, destinatario } = await inquirer.prompt([
    {
      type: 'input',
      name: 'numeroPedido',
      message: 'Número do pedido:'
    },
    {
      type: 'input',
      name: 'endereco',
      message: 'Endereço de entrega:'
    },
    {
      type: 'input',
      name: 'destinatario',
      message: 'Nome do destinatário:'
    }
  ]);

  const novoPedido = {
    pedido: {
      numeroPedido,
      itens: JSON.stringify(itens),
      quantidades: JSON.stringify(quantidades),
      endereco,
      destinatario
    }
  };

  try {
    const [result] = await client.RegistrarPedidoAsync(novoPedido);
    console.log('Resposta RegistrarPedido:', result.resposta);
  } catch (err) {
    console.error('Erro ao registrar pedido:', err);
  }
}

async function consultarPedido(client) {
  const { numeroPedido } = await inquirer.prompt({
    type: 'input',
    name: 'numeroPedido',
    message: 'Número do pedido para consulta:'
  });

  try {
    const [statusRes] = await client.ConsultarStatusAsync({ numeroPedido });
    console.log('Status do pedido:', statusRes.status);
  } catch (err) {
    console.error('Erro ao consultar status:', err);
  }
}

async function atualizarStatus(client) {
  const { numeroPedido, novoStatus } = await inquirer.prompt([
    {
      type: 'input',
      name: 'numeroPedido',
      message: 'Número do pedido a atualizar:'
    },
    {
      type: 'input',
      name: 'novoStatus',
      message: 'Novo status:'
    }
  ]);

  try {
    const [updRes] = await client.AtualizarStatusAsync({ numeroPedido, novoStatus });
    console.log('Resposta AtualizarStatus:', updRes.resposta);
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
  }
}

main().catch(err => console.error('Erro geral:', err));
