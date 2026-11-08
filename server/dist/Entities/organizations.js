"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organizations = void 0;
const typeorm_1 = require("typeorm");
const events_1 = require("./events");
const users_1 = require("./users");
let Organizations = class Organizations {
};
exports.Organizations = Organizations;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Organizations.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Organizations.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: () => 'CURRENT_TIMESTAMP', type: "timestamp without time zone" }),
    __metadata("design:type", String)
], Organizations.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => events_1.Events, (event) => event.org),
    __metadata("design:type", Array)
], Organizations.prototype, "events", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => users_1.Users, (user) => user.org),
    __metadata("design:type", Array)
], Organizations.prototype, "users", void 0);
exports.Organizations = Organizations = __decorate([
    (0, typeorm_1.Entity)()
], Organizations);
