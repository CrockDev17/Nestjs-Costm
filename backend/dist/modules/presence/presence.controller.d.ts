import { PresenceService } from './presence.service.js';
import { CreatePresenceDto } from './dto/create-presence.dto.js';
import { UpdatePresenceDto } from './dto/update-presence.dto.js';
import { CreatePresenceSessionDto } from './dto/create-presence-session.dto.js';
export declare class PresenceController {
    private readonly presenceService;
    constructor(presenceService: PresenceService);
    create(dto: CreatePresenceDto): Promise<import("./presence.entity.js").Presence>;
    findMyPresences(req: any): Promise<import("./presence.entity.js").Presence[]>;
    createSession(dto: CreatePresenceSessionDto, req: any): Promise<import("./presence-session.entity.js").PresenceSession>;
    listSessions(): Promise<import("./presence-session.entity.js").PresenceSession[]>;
    getSession(id: string): Promise<import("./presence-session.entity.js").PresenceSession>;
    closeSession(id: string): Promise<import("./presence-session.entity.js").PresenceSession>;
    scanSession(token: string, req: any): Promise<import("./presence.entity.js").Presence>;
    findAll(): Promise<import("./presence.entity.js").Presence[]>;
    findOne(id: string): Promise<import("./presence.entity.js").Presence>;
    update(id: string, dto: UpdatePresenceDto): Promise<import("./presence.entity.js").Presence>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
