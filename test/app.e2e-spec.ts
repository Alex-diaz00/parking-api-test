import { Test, TestingModule } from '@nestjs/testing';
import { Body, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LogModule } from '../src/log/log.module';

import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { RoleDto } from '../src/role/dto/role.dto';
import { CreateParkingPlaceDto } from '../src/parking/dto/create-parking-place.dto';
import { BookingDto } from '../src/parking/dto/booking.dto';
import { VehicleDto } from '../src/parking/dto/vehicle.dto';
import { StatusDto } from '../src/status/dto/status.dto';
import { UserModule } from '../src/user/user.module';
import { User } from '../src/user/domain/user.domain';
import { ParkingPlace } from 'src/parking/domain/parking-place.domain';
import { Booking } from 'src/parking/domain/booking.domain';


describe('Log test (e2e)', () => {
  let app: INestApplication;
  const testUser: CreateUserDto = {
    firstName: "Test",
    lastName: "Test",
    email: "testadmin@gmail.com",
    password: "Yn&3!6wc",
    role: new RoleDto("admin"),
    status: new StatusDto("active")
}
const testParking: CreateParkingPlaceDto = {
  name: "TestP1"
}
const testBooking: BookingDto = {
  vehicle: new VehicleDto("B1256"),
  startDate: new Date("2034-01-01T01:00") ,
  endDate: new Date("2034-01-04T01:00") ,
}

  let responseParking : ParkingPlace;
  let responseBooking : Booking;
  let clientUser : {user: User, token: string};

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, LogModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    
    await request(app.getHttpServer()).post('/user').send(testUser);
    const responselogin = await request(app.getHttpServer()).post('/auth/login').send({email: testUser.email, password: testUser.password});
    const resP = await request(app.getHttpServer()).post('/parking').send(testParking);
    clientUser = responselogin.body;
    responseParking = resP.body;

    const res = await request(app.getHttpServer()).post('/parking/create_booking').auth(`${clientUser.token}`,{type:'bearer'}).send(testBooking);
    responseBooking = res.body;

  });

  it('/ (GET)', async  () => {
    
    const res = await request(app.getHttpServer())
    .get('/log');
    expect(200);
    expect(res.body[res.body.length - 1]).toHaveProperty('message')

  });

  afterAll(async()=>{
    await request(app.getHttpServer()).delete(`/parking/booking/${responseBooking.id}`);

    await request(app.getHttpServer()).delete(`/parking/${responseParking.id}`);
    
    await request(app.getHttpServer()).delete(`/user/${clientUser.user.id}`);
})
});



describe('Update user test (e2e)', () => {
  let app: INestApplication;
  const testAdminUser: CreateUserDto = {
    firstName: "Test",
    lastName: "Test",
    email: "testadmin@gmail.com",
    password: "Yn&3!6wc",
    role: new RoleDto("admin"),
    status: new StatusDto("active")
}

  const testClientUser: CreateUserDto = {
  firstName: "Test",
  lastName: "Test",
  email: "testclient@gmail.com",
  password: "Yn&3!6wc",
  role: new RoleDto("client"),
  status: new StatusDto("active")
} 
const testClientUserModified: CreateUserDto = {
  firstName: "Alberto",
  lastName: "Benitez",
  email: "testclient@gmail.com",
  password: "Yn&3!6wc",
  role: new RoleDto("admin"),
  status: new StatusDto("active")
} 

  let clientUser : {user: User, token: string};
  let adminUser : {user: User, token: string};
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).post('/user').send(testAdminUser);
    const responseAdminLogin = await request(app.getHttpServer()).post('/auth/login').send({email: testAdminUser.email, password: testAdminUser.password});
    const responseClientLogin = await request(app.getHttpServer()).post('/auth/signup').send({email: testClientUser.email,
      password: testClientUser.password, firstName: testClientUser.firstName, lastName: testClientUser.lastName });
    
    clientUser = responseClientLogin.body;
    adminUser = responseAdminLogin.body;

  });

  it('/ (Patch)', async  () => {

    const res = await request(app.getHttpServer()).patch(`/user/${clientUser.user.id}`)
    .auth(`${adminUser.token}`,{type:'bearer'}).send(testClientUserModified);
    
    expect(res.body).toMatchObject({email: 'testclient@gmail.com'})
    expect(res.body).toHaveProperty('id')
    
  });

  afterAll(async()=>{
    await request(app.getHttpServer()).delete(`/user/${adminUser.user.id}`); 
    await request(app.getHttpServer()).delete(`/user/${clientUser.user.id}`);
})
});


describe('Create booking test (e2e)', () => {
  let app: INestApplication;
  
  const testUser: CreateUserDto = {
  firstName: "Test",
  lastName: "Test",
  email: "testclient@gmail.com",
  password: "Yn&3!6wc",
  role: new RoleDto("client"),
  status: new StatusDto("active")
} 

  const testParking: CreateParkingPlaceDto = {
    name: "TestP1"
  }
  const testBooking: BookingDto = {
    vehicle: new VehicleDto("B1256"),
    startDate: new Date("2034-01-01T01:00") ,
    endDate: new Date("2034-01-04T01:00") ,
  }

  let responseParking : ParkingPlace;
  let responseBooking : Booking;
  let clientUser : {user: User, token: string};
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).post('/user').send(testUser);
    const responselogin = await request(app.getHttpServer()).post('/auth/login').send({email: testUser.email, password: testUser.password});
    const resP = await request(app.getHttpServer()).post('/parking').send(testParking);
    clientUser = responselogin.body;
    responseParking = resP.body;

  });

  it('/ (Post)', async  () => {

    const res = await request(app.getHttpServer()).post('/parking/create_booking').auth(`${clientUser.token}`,{type:'bearer'}).send(testBooking);
    responseBooking = res.body;

    expect(res.body).toMatchObject({startDate: '2034-01-01T06:00:00.000Z'});
    expect(res.body).toMatchObject({vehicle: {"numberplate": "B1256",},});
    
  });

  afterAll(async()=>{
    await request(app.getHttpServer()).delete(`/parking/booking/${responseBooking.id}`);

    await request(app.getHttpServer()).delete(`/parking/${responseParking.id}`);
    
    await request(app.getHttpServer()).delete(`/user/${clientUser.user.id}`);
})
});
















describe('Occupated Parking places test (e2e)', () => {
  let app: INestApplication;
  
  const testUser: CreateUserDto = {
  firstName: "Test",
  lastName: "Test",
  email: "testadmin@gmail.com",
  password: "Yn&3!6wc",
  role: new RoleDto("admin"),
  status: new StatusDto("active")
} 

  const testParking: CreateParkingPlaceDto = {
    name: "TestP1"
  }
  const testBooking: BookingDto = {
    vehicle: new VehicleDto("B1256"),
    startDate: new Date("2034-01-01T01:00") ,
    endDate: new Date("2034-01-04T01:00") ,
  }

  let responseParking : ParkingPlace;
  let responseBooking : Booking;
  let adminUser : {user: User, token: string};
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).post('/user').send(testUser);
    const responselogin = await request(app.getHttpServer()).post('/auth/login').send({email: testUser.email, password: testUser.password});
    const resP = await request(app.getHttpServer()).post('/parking').send(testParking);
    adminUser = responselogin.body;
    responseParking = resP.body;
    const resB = await request(app.getHttpServer()).post('/parking/create_booking').auth(`${adminUser.token}`,{type:'bearer'}).send(testBooking);
    responseBooking = resB.body;

  });

  it('/ (Get)', async  () => {

    const resB = await request(app.getHttpServer()).get('/parking/occuped_parking_places').auth(`${adminUser.token}`,{type:'bearer'})
    .send({date: testBooking.startDate});
    
    expect(resB.body[0]).toHaveProperty('bookings')
    expect(resB.body).toMatchObject([{name: 'TestP1'}]);

    
  });

  afterAll(async()=>{
    await request(app.getHttpServer()).delete(`/parking/booking/${responseBooking.id}`);

    await request(app.getHttpServer()).delete(`/parking/${responseParking.id}`);
    
    await request(app.getHttpServer()).delete(`/user/${adminUser.user.id}`);
})
});