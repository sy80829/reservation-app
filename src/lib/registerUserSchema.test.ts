import { describe, it, expect } from 'vitest';
import { registerUserSchema } from './registerUserSchema';

describe('registerUserSchema', () => {
  it('正しい名前・電話番号は通る', () => {
    const result = registerUserSchema.safeParse({
      name: '山田太郎',
      tel: '09012345678',
    });

    expect(result.success).toBe(true);
  });

  it('名前が空だとエラーになる', () => {
    const result = registerUserSchema.safeParse({
      name: '',
      tel: '09012345678',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('name_required');
    }
  });

  it('名前が51文字以上だとエラーになる', () => {
    const result = registerUserSchema.safeParse({
      name: 'あ'.repeat(51),
      tel: '09012345678',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('name_too_long');
    }
  });

  it('電話番号が0から始まらないとエラーになる', () => {
    const result = registerUserSchema.safeParse({
      name: '山田太郎',
      tel: '19012345678',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('tel_invalid');
    }
  });

  it('電話番号に数字以外が含まれるとエラーになる', () => {
    const result = registerUserSchema.safeParse({
      name: '山田太郎',
      tel: '090-abcd-5678',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('tel_invalid');
    }
  });
});
