import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ParaSpellError } from '@paraspell/sdk';

export const handleXcmApiError = (error: unknown): never => {
  if (error instanceof ParaSpellError) {
    throw new BadRequestException(error.message);
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    // Intercetta errori di decodifica indirizzo / checksum non validi da librerie esterne (viem, polkadot-util-crypto, ethers)
    if (
      msg.includes('invalid checksum') ||
      msg.includes('invalid address') ||
      msg.includes('invalid base58') ||
      msg.includes('decoding not-an-address') ||
      msg.includes('address is invalid')
    ) {
      throw new BadRequestException(error.message);
    }
    throw new InternalServerErrorException(error.message);
  }

  throw new InternalServerErrorException('An unknown error occurred');
};
