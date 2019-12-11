const BaseTimestampLabelResolver = createBaseResolver(
  'TimestampLabel',
  TimestampLabel,
  {
    createArgsType: TimestampLabelCreateArgs,
    updateArgsType: TimestampLabelArgs
  }
);

@Resolver(() => TimestampLabel)
@UseGuards(GraphqlAccessTokenGuard)
export class TimestampLabelResolver extends BaseTimestampLabelResolver {
  constructor(timestampLabelService: TimestampLabelService) {
    super(timestampLabelService);
  }

  /**
   * Only allow updating timestamp labels for timestamp collections they created
   */
  updateFindOptions(_args: TimestampLabelArgs, user: AuthenticatedUser) {
    return this.modificationFindOptions(user);
  }

  /**
   * Only allow deleting timestamp labels for timestamp collections they created
   */
  deleteFindOptions(_args: TimestampLabelArgs, user: AuthenticatedUser) {
    return this.modificationFindOptions(user);
  }

  modificationFindOptions(user: AuthenticatedUser) {
    const options: FindOptions = {
      include: [
        {
          model: TimestampCollection,
          required: true,
          where: {
            createdById: user.id
          }
        }
      ]
    };
    return options;
  }
}
