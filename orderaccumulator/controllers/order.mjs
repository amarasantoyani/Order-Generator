let ordensEmMemoria = [];

export const processarOrdem = (req, res) => {
  const novaOrdem = {
    ativo: req.body.ativo,
    qtd: req.body.qtd,
    lado: req.body.lado,
    preco: req.body.preco,
  };

  ordensEmMemoria.push(novaOrdem);
  return res.status(200).json("Ordem criada com sucesso.");
};
