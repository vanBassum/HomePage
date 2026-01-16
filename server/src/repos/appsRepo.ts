import type Database from "better-sqlite3";
import type { AppRecord } from "homepage-shared";

export type CreateAppInput = Omit<AppRecord, "id">;

export class AppsRepo {
  public constructor(private readonly db: Database.Database) {}

  public getAll(): AppRecord[] {
    const rows = this.db
      .prepare(
        `SELECT id, name, description, link, iconUrl, category
         FROM apps
         ORDER BY name COLLATE NOCASE`
      )
      .all();

    return rows as AppRecord[];
  }

  public getById(id: number): AppRecord | undefined {
    const row = this.db
      .prepare(
        `SELECT id, name, description, link, iconUrl, category
         FROM apps
         WHERE id = ?`
      )
      .get(id);

    return row as AppRecord | undefined;
  }

  public create(input: CreateAppInput): AppRecord {
    const stmt = this.db.prepare(
      `INSERT INTO apps (name, description, link, iconUrl, category)
       VALUES (@name, @description, @link, @iconUrl, @category)`
    );

    const result = stmt.run({
      name: input.name,
      description: input.description,
      link: input.link,
      iconUrl: input.iconUrl ?? null,
      category: input.category ?? null,
    });

    const id = Number(result.lastInsertRowid);
    const created = this.getById(id);
    if (!created) throw new Error("Failed to read created record");
    return created;
  }

  public update(id: number, input: CreateAppInput): boolean {
    const stmt = this.db.prepare(
      `UPDATE apps
       SET name=@name, description=@description, link=@link, iconUrl=@iconUrl, category=@category
       WHERE id=@id`
    );

    const result = stmt.run({
      id,
      name: input.name,
      description: input.description,
      link: input.link,
      iconUrl: input.iconUrl ?? null,
      category: input.category ?? null,
    });

    return result.changes > 0;
  }

  public delete(id: number): boolean {
    const result = this.db.prepare(`DELETE FROM apps WHERE id = ?`).run(id);
    return result.changes > 0;
  }
}
