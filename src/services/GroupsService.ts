import { HttpError } from "../errors/HttpError";
import { CreateGroupAttributes, GroupsRepository } from "../repositories/GroupsRepository";

export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async getAllGroups() {
    const groups = await this.groupsRepository.find();
    return groups;
  }

  async createGroup(attributes: CreateGroupAttributes) {
    const newGroup = await this.groupsRepository.create(attributes);
    return newGroup;
  }

  async showGroup(id: number) {
    const group = await this.groupsRepository.findById(id);
    if (!group) throw new HttpError(404, "Grupo não encontrado");
    return group;
  }

  async updateGroup(id: number, attributes: Partial<CreateGroupAttributes>) {
    const updatedGroup = await this.groupsRepository.updateById(id, attributes);
    if (!updatedGroup) throw new HttpError(404, "Grupo não encontrado");
    return updatedGroup;
  }

  async deleteGroup(id: number) {
    const deletedGroup = await this.groupsRepository.deleteById(id);
    if (!deletedGroup) throw new HttpError(404, "Grupo não encontrado");
    return deletedGroup;
  }
}