const BaseTimestampLabelResolver = createBaseResolver(
  "TimestampLabel",
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
   * Only allow updating timestamp labels that were created by the user
   */
  updateFindOptions(_args: TimestampLabelArgs, user: AuthenticatedUser) {
    const options: FindOptions = {
      include: [
        {
          model: TimestampCollection,
          where: {
            createdById: user.id
          }
        }
      ]
    };
    return options;
  }
}
