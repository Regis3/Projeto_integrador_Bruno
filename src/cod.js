function getData(key){
  try{
    return JSON.parse(localStorage.getItem(key)) || [];
  }catch(e){
    return [];
  }
}
function setData(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

let onibusList = getData('onibusList');
let rotasList = getData('rotasList');
let pontosList = getData('pontosList');
let alunosList = getData('alunosList');

// ---------- Navegação entre seções ----------
const navButtons = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('main section');

navButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    navButtons.forEach(b=>b.classList.remove('active'));
    sections.forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

// ---------- Funções auxiliares de UI ----------
function criarItemLista(texto, subtexto, onDelete){
  const li = document.createElement('li');
  const info = document.createElement('div');
  info.className = 'info';
  const strong = document.createElement('strong');
  strong.textContent = texto;
  const span = document.createElement('span');
  span.className = 'sub';
  span.textContent = subtexto;
  info.appendChild(strong);
  info.appendChild(span);
  const btn = document.createElement('button');
  btn.className = 'btn-danger';
  btn.textContent = 'Excluir';
  btn.addEventListener('click', onDelete);
  li.appendChild(info);
  li.appendChild(btn);
  return li;
}

function mensagemVazia(texto){
  const p = document.createElement('p');
  p.className = 'empty';
  p.textContent = texto;
  return p;
}

// ---------- ÔNIBUS ----------
const formOnibus = document.getElementById('form-onibus');
const listaOnibus = document.getElementById('lista-onibus');

function renderOnibus(){
  listaOnibus.innerHTML = '';
  if(onibusList.length === 0){
    listaOnibus.appendChild(mensagemVazia('Nenhum ônibus cadastrado ainda.'));
  } else {
    onibusList.forEach((o, idx)=>{
      const li = criarItemLista(o.nome, 'Placa: ' + o.placa, ()=>{
        onibusList.splice(idx,1);
        setData('onibusList', onibusList);
        renderOnibus();
        renderSelects();
      });
      listaOnibus.appendChild(li);
    });
  }
}

formOnibus.addEventListener('submit', e=>{
  e.preventDefault();
  const nome = document.getElementById('onibus-nome').value.trim();
  const placa = document.getElementById('onibus-placa').value.trim();
  if(!nome || !placa) return;
  onibusList.push({nome, placa});
  setData('onibusList', onibusList);
  formOnibus.reset();
  renderOnibus();
  renderSelects();
});

// ---------- ROTAS ----------
const formRotas = document.getElementById('form-rotas');
const listaRotas = document.getElementById('lista-rotas');
const selectRotaOnibus = document.getElementById('rota-onibus');

function renderSelects(){
  // Ônibus no select de rotas
  selectRotaOnibus.innerHTML = '<option value="">Selecione um ônibus</option>';
  onibusList.forEach((o, idx)=>{
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = o.nome + ' (' + o.placa + ')';
    selectRotaOnibus.appendChild(opt);
  });

  // Rotas nos selects de pontos e alunos
  const selectPontoRota = document.getElementById('ponto-rota');
  const selectAlunoRota = document.getElementById('aluno-rota');
  [selectPontoRota, selectAlunoRota].forEach(sel=>{
    const atual = sel.value;
    sel.innerHTML = '<option value="">Selecione uma rota</option>';
    rotasList.forEach((r, idx)=>{
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = r.nome;
      sel.appendChild(opt);
    });
    sel.value = atual;
  });
}

function renderRotas(){
  listaRotas.innerHTML = '';
  if(rotasList.length === 0){
    listaRotas.appendChild(mensagemVazia('Nenhuma rota cadastrada ainda.'));
  } else {
    rotasList.forEach((r, idx)=>{
      const onibus = onibusList[r.onibusIdx];
      const nomeOnibus = onibus ? onibus.nome : 'Ônibus removido';
      const li = criarItemLista(r.nome, 'Horário: ' + r.horario + ' | Ônibus: ' + nomeOnibus, ()=>{
        rotasList.splice(idx,1);
        setData('rotasList', rotasList);
        renderRotas();
        renderSelects();
      });
      listaRotas.appendChild(li);
    });
  }
}

formRotas.addEventListener('submit', e=>{
  e.preventDefault();
  const nome = document.getElementById('rota-nome').value.trim();
  const horario = document.getElementById('rota-horario').value;
  const onibusIdx = document.getElementById('rota-onibus').value;
  if(!nome || !horario || onibusIdx === '') return;
  rotasList.push({nome, horario, onibusIdx: Number(onibusIdx)});
  setData('rotasList', rotasList);
  formRotas.reset();
  renderRotas();
  renderSelects();
});

// ---------- PONTOS ----------
const formPontos = document.getElementById('form-pontos');
const listaPontos = document.getElementById('lista-pontos');

function renderPontos(){
  listaPontos.innerHTML = '';
  if(pontosList.length === 0){
    listaPontos.appendChild(mensagemVazia('Nenhum ponto cadastrado ainda.'));
  } else {
    pontosList.forEach((p, idx)=>{
      const rota = rotasList[p.rotaIdx];
      const nomeRota = rota ? rota.nome : 'Rota removida';
      const li = criarItemLista(p.nome, 'Rota: ' + nomeRota, ()=>{
        pontosList.splice(idx,1);
        setData('pontosList', pontosList);
        renderPontos();
      });
      listaPontos.appendChild(li);
    });
  }
}

formPontos.addEventListener('submit', e=>{
  e.preventDefault();
  const nome = document.getElementById('ponto-nome').value.trim();
  const rotaIdx = document.getElementById('ponto-rota').value;
  if(!nome || rotaIdx === '') return;
  pontosList.push({nome, rotaIdx: Number(rotaIdx)});
  setData('pontosList', pontosList);
  formPontos.reset();
  renderPontos();
});

// ---------- ALUNOS ----------
const formAlunos = document.getElementById('form-alunos');
const listaAlunos = document.getElementById('lista-alunos');

function renderAlunos(){
  listaAlunos.innerHTML = '';
  if(alunosList.length === 0){
    listaAlunos.appendChild(mensagemVazia('Nenhum aluno cadastrado ainda.'));
  } else {
    alunosList.forEach((a, idx)=>{
      const rota = rotasList[a.rotaIdx];
      const nomeRota = rota ? rota.nome : 'Rota removida';
      const li = criarItemLista(a.nome, 'Matrícula: ' + a.matricula + ' | Rota: ' + nomeRota, ()=>{
        alunosList.splice(idx,1);
        setData('alunosList', alunosList);
        renderAlunos();
      });
      listaAlunos.appendChild(li);
    });
  }
}

formAlunos.addEventListener('submit', e=>{
  e.preventDefault();
  const nome = document.getElementById('aluno-nome').value.trim();
  const matricula = document.getElementById('aluno-matricula').value.trim();
  const rotaIdx = document.getElementById('aluno-rota').value;
  if(!nome || !matricula || rotaIdx === '') return;
  alunosList.push({nome, matricula, rotaIdx: Number(rotaIdx)});
  setData('alunosList', alunosList);
  formAlunos.reset();
  renderAlunos();
});

// ---------- CONSULTA ----------
const buscaInput = document.getElementById('busca-rota');
const btnBuscar = document.getElementById('btn-buscar');
const resultadoDiv = document.getElementById('resultado-consulta');

function buscarRota(){
  const termo = buscaInput.value.trim().toLowerCase();
  resultadoDiv.innerHTML = '';
  if(!termo){
    resultadoDiv.appendChild(mensagemVazia('Digite o nome de uma rota para buscar.'));
    return;
  }
  const encontradas = rotasList
    .map((r, idx)=>({...r, idx}))
    .filter(r=>r.nome.toLowerCase().includes(termo));

  if(encontradas.length === 0){
    resultadoDiv.appendChild(mensagemVazia('Nenhuma rota encontrada com esse nome.'));
    return;
  }

  encontradas.forEach(r=>{
    const onibus = onibusList[r.onibusIdx];
    const nomeOnibus = onibus ? (onibus.nome + ' - Placa: ' + onibus.placa) : 'Não definido';
    const pontosRota = pontosList.filter(p=>p.rotaIdx === r.idx);
    const alunosRota = alunosList.filter(a=>a.rotaIdx === r.idx);

    const card = document.createElement('div');
    card.className = 'result-card';

    const h3 = document.createElement('h3');
    h3.textContent = r.nome;
    card.appendChild(h3);

    const pHorario = document.createElement('p');
    pHorario.innerHTML = '<strong>Horário:</strong> ' + r.horario;
    card.appendChild(pHorario);

    const pOnibus = document.createElement('p');
    pOnibus.innerHTML = '<strong>Ônibus:</strong> ' + nomeOnibus;
    card.appendChild(pOnibus);

    const pPontosTitulo = document.createElement('p');
    pPontosTitulo.innerHTML = '<strong>Pontos de parada:</strong>';
    card.appendChild(pPontosTitulo);
    if(pontosRota.length === 0){
      card.appendChild(mensagemVazia('Nenhum ponto cadastrado para esta rota.'));
    } else {
      const ulP = document.createElement('ul');
      pontosRota.forEach(p=>{
        const li = document.createElement('li');
        li.textContent = p.nome;
        ulP.appendChild(li);
      });
      card.appendChild(ulP);
    }

    const pAlunosTitulo = document.createElement('p');
    pAlunosTitulo.innerHTML = '<strong>Alunos:</strong>';
    card.appendChild(pAlunosTitulo);
    if(alunosRota.length === 0){
      card.appendChild(mensagemVazia('Nenhum aluno cadastrado para esta rota.'));
    } else {
      const ulA = document.createElement('ul');
      alunosRota.forEach(a=>{
        const li = document.createElement('li');
        li.textContent = a.nome + ' (Matrícula: ' + a.matricula + ')';
        ulA.appendChild(li);
      });
      card.appendChild(ulA);
    }

    resultadoDiv.appendChild(card);
  });
}

btnBuscar.addEventListener('click', buscarRota);
buscaInput.addEventListener('keyup', e=>{
  if(e.key === 'Enter') buscarRota();
});

// ---------- Inicialização ----------
renderOnibus();
renderSelects();
renderRotas();
renderPontos();
renderAlunos();
resultadoDiv.appendChild(mensagemVazia('Digite o nome de uma rota para buscar.'));
