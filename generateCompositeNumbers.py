def prime_factors(n):
    factors = []
    divisor = 2
    while n > 1:
        while n % divisor == 0:
            factors.append(divisor)
            n //= divisor
        divisor += 1
        if divisor * divisor > n:
            if n > 1:
                factors.append(n)
            break
    return factors

def filter_numbers(min_val, max_val):
    result = []
    for num in range(min_val, max_val):
        factors = prime_factors(num)
        smallest_prime = factors[0] if factors else None
        if smallest_prime and smallest_prime > 5 and smallest_prime < max_val / 10:
            result.append(num)
    return result

min_value = 100
max_value = 1000
filtered_numbers = filter_numbers(min_value, max_value)
print(filtered_numbers)
