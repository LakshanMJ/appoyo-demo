import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
// import { UpdateShiftDto } from './dto/update-shift.dto';
// import { GetShiftsDto } from './dto/get-shifts.dto';
// import { CheckConflictDto } from './dto/check-conflict.dto';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  // @Get()
  // findAll(@Query() query: GetShiftsDto) {
  //   return this.shiftsService.findAll(query);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.shiftsService.findOne(id);
  // }

  // @Post('check-conflict')
  // checkConflict(@Body() dto: CheckConflictDto) {
  //   return this.shiftsService.checkConflict(dto);
  // }

  @Post()
  create(@Body() dto: CreateShiftDto) {
    return this.shiftsService.create(dto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateShiftDto) {
  //   return this.shiftsService.update(id, dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.shiftsService.remove(id);
  // }
}