import { PresenceService } from './presence.service';
import { CreatePresenceDto } from './dto/create-presence.dto';
export declare class PresenceController {
    private readonly presenceService;
    constructor(presenceService: PresenceService);
    create(createPresenceDto: CreatePresenceDto): Promise<import("./presence.entity").Presence>;
    findAll(): Promise<import("./presence.entity").Presence[]>;
}
