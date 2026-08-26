## 1. Matriz RBAC

A Matriz RBAC define o que cada tipo de usuário pode fazer no sistema.

| Função              | Administrador | Funcionário | Aluno/Responsável |
|----------------------|:--------------:|:-----------:|:------------------:|
| Consultar rotas       | ✅ | ✅ | ✅ |
| Consultar horários    | ✅ | ✅ | ✅ |
| Cadastrar ônibus      | ✅ | ❌ | ❌ |
| Cadastrar rotas       | ✅ | ❌ | ❌ |
| Cadastrar alunos      | ✅ | ❌ | ❌ |
| Alterar informações   | ✅ | ❌ | ❌ |

### Regras de Negócio
- Cada aluno deve estar vinculado a uma rota.
- Cada rota deve possuir um ou mais pontos de parada.
- Cada ônibus pode realizar uma rota.
- Os horários devem estar vinculados às rotas.
- Apenas o administrador pode cadastrar ou alterar informações.

## 2. Diagrama de Fluxo

\`\`\`mermaid
flowchart TD
    A[Início] --> B[Login no sistema]
    B --> C{Tipo de usuário}

    C -->|Administrador| D[Gerenciar ônibus e rotas]
    C -->|Funcionário| E[Consultar informações]
    C -->|Aluno/Responsável| F[Consultar rota e horário]

    D --> G[Salvar informações]
    E --> H[Visualizar dados]
    F --> H

    G --> I[Fim]
    H --> I
\`\`\`

## 3. Modelo de Dados (DER)

\`\`\`mermaid
erDiagram
    ONIBUS ||--o{ ROTA : realiza
    ROTA ||--o{ PONTO : possui
    ROTA ||--o{ ALUNO : atende
    ROTA ||--o{ HORARIO : possui

    ONIBUS {
        int id
        string identificacao
        int capacidade
    }

    ROTA {
        int id
        string nome
    }

    PONTO {
        int id
        string nome
    }

    ALUNO {
        int id
        string nome
    }

    HORARIO {
        int id
        string horario
    }
\`\`\`
