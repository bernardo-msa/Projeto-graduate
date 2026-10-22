import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // NOMES / MATRÍCULAS DE EXEMPLO. Reexecutar não duplica registros.
  const cc = await prisma.curso.upsert({
    where: { codigo: 'CC' },
    update: {},
    create: {
      codigo: 'CC', nome: 'Ciência da Computação', matriz: '2023',
      creditosTotais: 160, semestresPrevistos: 8,
    },
  });
  const si = await prisma.curso.upsert({
    where: { codigo: 'SI' }, update: {},
    create: {
      codigo: 'SI', nome: 'Sistemas de Informação', matriz: '2024',
      creditosTotais: 160, semestresPrevistos: 8,
    },
  });
  const disciplinas = [
    ['MAT001','Cálculo I',4], ['MAT002','Cálculo II',4],
    ['DCC001','Algoritmos e Programação',4], ['CC204','Estruturas de Dados',4],
    ['FIS001','Física I',4],
  ] as const;
  const registro = new Map<string,string>();
  for (const [codigo, nome, creditos] of disciplinas) {
    const d = await prisma.disciplina.upsert({
      where: { cursoId_codigo: { cursoId: cc.id, codigo } },
      update: {}, create: { cursoId: cc.id, codigo, nome, creditos },
    });
    registro.set(codigo,d.id);
  }
  await prisma.disciplina.upsert({
    where: { cursoId_codigo: { cursoId: si.id, codigo: 'SI101' } },
    update: {}, create: { cursoId: si.id, codigo:'SI101', nome:'Introdução a SI', creditos:4 },
  });
  const alunos = [
    { matricula:'DEMO0001', nome:'Mariana Alves (exemplo)', email:'mariana@example.invalid',
      cursoId:cc.id, periodoIngresso:'2023.1', modalidadeIngresso:'Não informada', cr:6.4, creditosConcluidos:68 },
    { matricula:'DEMO0002', nome:'Lucas Santos (exemplo)', email:'lucas@example.invalid',
      cursoId:cc.id, periodoIngresso:'2022.1', modalidadeIngresso:'Ampla concorrência', cr:8.2, creditosConcluidos:112 },
    { matricula:'DEMO0003', nome:'Beatriz Farias (exemplo)', email:'beatriz@example.invalid',
      cursoId:cc.id, periodoIngresso:'2021.2', modalidadeIngresso:'Não informada', cr:4.9, creditosConcluidos:64 },
    { matricula:'DEMO0004', nome:'Gabriel Rocha (exemplo)', email:'gabriel@example.invalid',
      cursoId:cc.id, periodoIngresso:'2023.2', modalidadeIngresso:'Ampla concorrência', cr:3.8, creditosConcluidos:24 },
    { matricula:'DEMO0005', nome:'Carla Lima (exemplo)', email:'carla@example.invalid',
      cursoId:si.id, periodoIngresso:'2024.1', modalidadeIngresso:'Não informada', cr:7.6, creditosConcluidos:44 },
  ];
  const ids = new Map<string,string>();
  for (const aluno of alunos) {
    const saved = await prisma.aluno.upsert({
      where:{ matricula:aluno.matricula }, update:{}, create:aluno,
    });
    ids.set(aluno.matricula,saved.id);
  }
  const tentativas = [
    ['DEMO0001','MAT001','2023.1',4.2,88,'REPROVADO_NOTA'],
    ['DEMO0001','MAT001','2023.2',5.4,82,'REPROVADO_NOTA'],
    ['DEMO0001','DCC001','2023.1',8.5,95,'APROVADO'],
    ['DEMO0002','CC204','2025.1',9.2,96,'APROVADO'],
    ['DEMO0003','MAT002','2024.1',3.0,81,'REPROVADO_NOTA'],
    ['DEMO0004','DCC001','2024.1',2.0,62,'REPROVADO_FALTA'],
  ] as const;
  for (const [matricula, codigo, periodo, nota, frequencia, situacao] of tentativas) {
    const alunoId = ids.get(matricula)!;
    const disciplinaId = registro.get(codigo)!;
    await prisma.tentativa.upsert({
      where:{ alunoId_disciplinaId_periodo: { alunoId, disciplinaId, periodo } },
      update:{}, create:{ alunoId, disciplinaId, periodo, nota, frequencia, situacao },
    });
  }
  console.log('Dados fictícios carregados: 2 cursos, 6 disciplinas, 5 alunos.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
