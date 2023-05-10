import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfettiService } from '@app/services/confetti/confetti.service';
import { ConfettiCannonDirective } from './confetti-cannon.directive';

@Component({
  template: `<div [confettiCannon]="shouldFireCannon"></div>`,
})
class TestComponent {
  shouldFireCannon: boolean = false;
}

describe('ConfettiCannonDirective', () => {
  let component: TestComponent;
  let cannon: HTMLDivElement;
  let cannons: any[];
  let confettiServiceSpy: any;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ConfettiCannonDirective, TestComponent],
    }).createComponent(TestComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();

    // all elements with an attached ConfettiCannonDirective
    cannons = fixture.debugElement.queryAll(
      By.directive(ConfettiCannonDirective)
    );

    cannon = cannons[0].nativeElement;
    const confettiService = fixture.debugElement.injector.get(ConfettiService);

    confettiServiceSpy = spyOn(confettiService, 'cannon').and.callThrough();
  });

  it('should not call the confetti service when falsey', () => {
    component.shouldFireCannon = false;
    fixture.detectChanges();

    expect(confettiServiceSpy).not.toHaveBeenCalled();
  });

  it('should call the confetti service when truthy', () => {
    component.shouldFireCannon = true;
    fixture.detectChanges();

    expect(confettiServiceSpy).toHaveBeenCalled();
  });
});
