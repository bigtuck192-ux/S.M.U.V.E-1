import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubComponent } from './hub.component';

describe('HubComponent', () => {
  let _component: HubComponent;
  let _fixture: ComponentFixture<HubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubComponent],
    }).compileComponents();
  });

  it('should be defined', () => {
    expect(HubComponent).toBeDefined();
  });
});
