import { Body, Controller, Get, Post } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(
    private readonly participantsService: ParticipantsService,
  ) {}

  @Post()
  create(@Body() dto: CreateParticipantDto,) {
    return this.participantsService.create(dto);
  }


  @Get()
  findAll() {
    return this.participantsService.findAll();
  }
}