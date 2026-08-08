import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { MoveShiftDto } from './dto/move-shift.dto';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) { }

  @Post()
  create(@Body() dto: CreateShiftDto) {
    return this.shiftsService.create(dto);
  }

  @Get()
  findAll(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.shiftsService.findAll(startDate, endDate);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: CreateShiftDto,
  ) {
    return this.shiftsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shiftsService.remove(id);
  }

  @Patch(':id/move')
  move(
    @Param('id') id: string,
    @Body() dto: MoveShiftDto,
  ) {
    console.log('MOVE CONTROLLER BODY:', dto);
    console.log('startTime:', dto.startTime);
    console.log('endTime:', dto.endTime);
    console.log('participantId:', dto.participantId);
    return this.shiftsService.move(id, dto);
  }
}