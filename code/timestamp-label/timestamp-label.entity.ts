@ObjectType()
@Table({
  tableName: "timestamp_labels",
  underscored: true
})
@RegisterEntity()
export class TimestampLabel extends CreatedByEntity<TimestampLabel> {
  @AllowNull(false)
  @ForeignKey(() => TimestampCollection)
  @Column({
    type: Sequelize.BIGINT,
    field: "timestamp_collection_id"
  })
  timestampCollectionId: number;

  @Field()
  @AllowNull(false)
  @Column({
    type: Sequelize.STRING,
    field: "title"
  })
  title: string;

  @Field()
  @AllowNull(false)
  @Column({
    type: Sequelize.INTEGER,
    field: "position"
  })
  position: number;

  @BelongsTo(() => TimestampCollection)
  timestampCollection: TimestampCollection;
}
