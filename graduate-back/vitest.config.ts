import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'src/common/triagem.ts',
        'src/common/validation.ts',
        'src/modules/alunos/alunos.service.ts',
      ],
    },
  },
});