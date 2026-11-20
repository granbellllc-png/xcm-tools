import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ParaSpellError } from '@paraspell/sdk';
import { describe, expect, it } from 'vitest';

import { handleXcmApiError } from './error-handler.js';

describe('handleXcmApiError', () => {
  it('throws BadRequestException for ParaSpell errors', () => {
    const handleError = () =>
      handleXcmApiError(new ParaSpellError('SDK error'));

    expect(handleError).toThrow(BadRequestException);
    expect(handleError).toThrow('SDK error');
  });

  it('throws BadRequestException for invalid address/checksum errors from underlying crypto decoders', () => {
    expect(() => handleXcmApiError(new Error('Invalid checksum'))).toThrow(BadRequestException);
    expect(() => handleXcmApiError(new Error('Decoding not-an-address: Invalid base58 character'))).toThrow(BadRequestException);
    expect(() => handleXcmApiError(new Error('Invalid address format'))).toThrow(BadRequestException);
  });

  it('throws InternalServerErrorException for other errors', () => {
    const handleError = () => handleXcmApiError(new Error('Unexpected database failure'));

    expect(handleError).toThrow(InternalServerErrorException);
    expect(handleError).toThrow('Unexpected database failure');
  });

  it('uses a generic message for non-error values', () => {
    const handleError = () => handleXcmApiError('Unexpected value');

    expect(handleError).toThrow(InternalServerErrorException);
    expect(handleError).toThrow('An unknown error occurred');
  });
});
