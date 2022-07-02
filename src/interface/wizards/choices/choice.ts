export class Choice {
  constructor(
    public readonly name: string,
    public readonly value: string | number,
    public readonly short?: string,
    public readonly type: 'choice' | 'separator' = 'choice'
  ) {}
}
