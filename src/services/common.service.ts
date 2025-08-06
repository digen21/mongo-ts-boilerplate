import { Model, Document } from 'mongoose';

export default class CommonService<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>) {
    return await this.model.create(data);
  }

  async findOne(filter: Partial<Record<keyof T, any>>) {
    return await this.model.findOne(filter);
  }

  async findAll(filter: Partial<Record<keyof T, any>> = {}) {
    return await this.model.find(filter);
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async update(id: string, data: Partial<T>) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}
