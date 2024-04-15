import express from 'express';
import { router } from './routes/orders.mjs'; 
import cors from 'cors';

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true,
    optionsSuccessStatus: 200 
  }));
  
app.use(express.json()); 

app.use('/orderaccumulator', router);

const exposicaoFinanceiraPorAtivo = {
    PETR4: 0.00,
    VALE3: 0.00,
    VIIA4: 0.00
};
const exposicaoProposta = 0;

const limiteExposicao = 1000000.00;

app.get('/orderaccumulator/ordem', (req, res) => {
    res.status(405).send('Este endpoint não suporta requisições GET. Use POST para enviar uma ordem.');
});


app.post('/orderaccumulator/ordem', (req, res) => {
    const { ativo , qtd , lado , preco } = req.body;

    const exposicaoAtual = parseFloat(exposicaoFinanceiraPorAtivo[ativo].toFixed(2));
    const exposicaoProposta = lado === 'C' ? parseFloat((exposicaoAtual + (qtd * preco)).toFixed(2)) : parseFloat((exposicaoAtual - (qtd * preco)).toFixed(2));

    if (exposicaoProposta > limiteExposicao) {
        console.log(`Exposição financeira ultrapassa limite de R$ 1.000.000. ExposicaoProposta: R$ ${exposicaoProposta}`);
        return res.status(200).json({ sucesso: false, msg_erro: `Exposição financeira ultrapassa limite de R$ 1.000.000` });
    }

    exposicaoFinanceiraPorAtivo[ativo] = exposicaoProposta;

    console.log(`Ordem recebida - Ativo: ${ativo}, Lado: ${lado}, Quantidade: ${qtd}, Preço: R$ ${preco}`);
    console.log(`Exposição financeira total do ativo ${ativo} atualizada: R$ ${exposicaoProposta}`);

    return res.status(200).json({ sucesso: true, exposicao_atual: exposicaoProposta });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
