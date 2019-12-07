@Injectable()
export class TimestampLabelService extends BaseService<TimestampLabel> {
  constructor(
    @Inject(TimestampCollectionTokens.TimestampLabelRepositoryToken)
    timestampLabelRepository: typeof TimestampLabel,
    private readonly timestampCollectionService: TimestampCollectionService
  ) {
    super("TimestampLabel", timestampLabelRepository);
  }

  async create(values: TimestampLabelCreateArgs, user: AuthenticatedUser) {
    const { timestampCollectionIdentity, ...rest } = values;
    const timestampCollection = await this.timestampCollectionService.ifExists(
      this.timestampCollectionService.findByIdentity(
        timestampCollectionIdentity,
        // only allow creating labels on collections the user owns
        {
          where: {
            createdById: user.id
          }
        }
      ),
      new ApolloInvalidRecordError(timestampCollectionIdentity)
    );
    const createValues: AttributesOf<TimestampLabel> = {
      timestampCollectionId: timestampCollection.id,
      position: timestampCollection.labelsCount,
      ...rest
    };
    timestampCollection.labelsCount = timestampCollection.labelsCount + 1;
    await timestampCollection.save();
    return await super.create(createValues, user);
  }

  protected async getBaseFindOptions(user?: AuthenticatedUser) {
    const where: WhereOptions[] = [{ public: true }];
    if (user) {
      where.push({ createdById: true });
    }
    // only find timestamp labels that belong to the user or are public
    const options: FindOptions = {
      include: [
        {
          model: TimestampCollection,
          required: true,
          where: {
            [Op.or]: [
              {
                createdById: user.id
              },
              {
                public: true
              }
            ]
          }
        }]
    };
    return options;
  }
}
