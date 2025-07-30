using System.Linq.Expressions;

namespace BE_Nhahang.Helpers
{
    public static class SearchQueryHelper
    {
        public static IQueryable<T> ApplyKeywordFilter<T>(IQueryable<T> query, string? keyword, params string[] propertyNames)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return query;

            var parameter = Expression.Parameter(typeof(T), "x");
            Expression? predicate = null;

            foreach (var property in propertyNames)
            {
                var prop = Expression.Property(parameter, property);
                var toLower = Expression.Call(prop, typeof(string).GetMethod("ToLower", Type.EmptyTypes)!);
                var keywordExpr = Expression.Constant(keyword.ToLower());
                var contains = Expression.Call(toLower, typeof(string).GetMethod("Contains", new[] { typeof(string) })!, keywordExpr);

                predicate = predicate == null ? contains : Expression.OrElse(predicate, contains);
            }

            var lambda = Expression.Lambda<Func<T, bool>>(predicate!, parameter);
            return query.Where(lambda);
        }

    }

    public static class PredicateBuilder
    {
        public static Expression<Func<T, bool>> False<T>() => f => false;

        public static Expression<Func<T, bool>> Or<T>(
            this Expression<Func<T, bool>> expr1,
            Expression<Func<T, bool>> expr2)
        {
            var parameter = Expression.Parameter(typeof(T));

            var combined = Expression.Lambda<Func<T, bool>>(
                Expression.OrElse(
                    Expression.Invoke(expr1, parameter),
                    Expression.Invoke(expr2, parameter)),
                parameter);

            return combined;
        }
    }
}
