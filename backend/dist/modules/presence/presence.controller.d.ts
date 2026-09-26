import { PresenceService } from './presence.service.js';
import { CreatePresenceDto } from './dto/create-presence.dto.js';
export declare class PresenceController {
    private readonly presenceService;
    constructor(presenceService: PresenceService);
    create(createPresenceDto: CreatePresenceDto): Promise<import("./presence.entity.js").Presence>;
    findAll(): Promise<import("./presence.entity.js").Presence[]>;
}
